const fs = require('fs');
const path = require('path');
const queryString = require('query-string');
const Url = require('url-parse');
const JSONC = require('jsonc');
const glob = require('glob');

const getFolderName = pathTo => {
  let vf = pathTo.split(path.sep);
  vf = vf[vf.length - 1];
  vf = vf == '_' ? '/' : vf;
  return vf;
};

module.exports = async args => {
  let { request, website, data } = args;

  let url = new Url(request.url);

  let folder = path.join(website.path, '_', url.pathname === '/' ? '' : url.pathname);

  let query = queryString.parse(url.query);

  let lid = query.lid;

  if (lid) {
    try {
      let layouts = await glob.sync(path.join(website.path, '_', '**/!(_).jsonc'));

      layouts = layouts.map(file => ({
        ...JSONC.parse(fs.readFileSync(file, 'utf8')),
        file
      }));

      let layout = layouts.find(x => x.lid === lid);

      if (!layout) {
        throw `LID: ${lid} doesn't exist`;
      }

      return {
        ...args,
        layout
      };
    } catch (error) {
      console.error(error);
      throw 'LID not found';
    }
  } else {
    let existPath = fs.existsSync(folder);

    if (existPath) {
      let layouts = await glob.sync(path.join(folder, '!(_).jsonc'));

      layouts = layouts.map(file => ({
        ...JSONC.parse(fs.readFileSync(file, 'utf8')),
        file
      }));

      if (layouts.filter(x => x.active && x.default).length > 1) {
        throw 'There cannot be more than one default page. ' + `(Path: ${folder})`;
      }

      let layout = layouts.find(x => x.active && x.default);

      layout.virtualFolder = getFolderName(folder);

      return {
        ...args,
        layout
      };
    } else {
      console.log(request.url);
      throw 'Redirect not supported yet!';

      // const redirects = JSONC.parse(fs.readFileSync(path.join(process.env.VTEXY_DATA, 'sites/redirects.jsonc')));

      // redirects = JSON.stringify(redirects)
      //     .replace('{idProduto}', '*')
      //     .replace('{nomeProduto}', '*')
      //     .replace('{idDepartamento}', '*')
      //     .replace('{nomeDepartamento}', '*')
      //     .replace('{nomeCategoria}', '*')
      //     .replace('{queryString}', '*');

      // redirects = JSON.parse(redirects);

      // console.log(redirects)
    }
  }
};
