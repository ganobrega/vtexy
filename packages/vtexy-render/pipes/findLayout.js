const { readFileSync, existsSync } = require('fs');
const path = require('path');
// const queryString = require('query-string');
const Url = require('url-parse');
const JSONC = require('jsonc');
const glob = require('glob');
const { LayoutSchema } = require('../../vtexy-schemas');

const getFolderName = pathTo => {
  let vf = pathTo.split(path.sep);
  vf = vf[vf.length - 1];
  vf = vf == '_' ? '/' : vf;
  return vf;
};

const defaultRoutes = [
  {
    path: '/',
    type: 'default',
    folder: '_'
  },
  {
    path: '/Produto/',
    type: 'product',
    folder: 'Produto/@Produto@'
  },
  {
    path: '/departamento/',
    type: 'departament',
    folder: 'Departamento/@departamento@'
  },
  {
    path: '/categoria/',
    type: 'category',
    folder: 'Categoria/@categoria@'
  }
];

module.exports = async args => {
  const { request, website } = args;

  const url = new Url(request.url);

  const folder = path.join(website.path, '_', url.pathname === '/' ? '' : url.pathname);

  const redirects = JSONC.parse(await readFileSync(path.join(process.env.VTEXY_DATA, 'redirects.jsonc'), 'utf8'));

  // const isRedirectPath = redirects.find(redirect => {
  //   let path = redirect.path.split('/');

  //   path['{}'];
  // });
  // const isDefaultRoute = defaultRoutes.find(route => ~url.pathname.indexOf(route.path));

  // Respecting path
  if (existsSync(folder)) {
    let layouts = await glob.sync(path.join(folder, '!(_).jsonc'));

    layouts = await Promise.all(
      layouts.map(async file => ({
        ...(await LayoutSchema.validateSync(JSONC.parse(await readFileSync(file, 'utf8')))),
        file
      }))
    );

    if (layouts.filter(x => x.active && x.default).length > 1) {
      throw 'There cannot be more than one default page. ' + `(Path: ${folder})`;
    }

    let layout = layouts.find(x => x.active && x.default);

    layout.virtualFolder = getFolderName(folder);

    return {
      ...args,
      layout
    };
  }
};
