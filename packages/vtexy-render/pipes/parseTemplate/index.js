const fs = require('fs');
const path = require('path');
const posthtml = require('posthtml');
const posthtmlParser = require('posthtml-parser');
const parseCollection = require('./parseShelf');

const convertVTEXPlaceholderContentType = (data, placeholder, request) =>
  new Promise(async resolve => {
    console.log(data, placeholder, request);
    if (placeholder === undefined) return '';

    switch (placeholder.type) {
      case 'banner':
        resolve(`
          <div class="box-banner">
            <a><img width="${data.width}" height="${data.height}" id="" alt="${data.name}" src="${data.file}" /></a>
          </div>
        `);
        break;

      case 'html':
        resolve(data.html);
        break;

      case 'collection':
        resolve(parseCollection(placeholder, request));
        break;

      default:
        break;
    }
  });

const postHtmlVtex = ({ layout, request, ...args }) => tree => {
  return new Promise(async (resolve, reject) => {
    // Placeholders
    let placeholders = [];
    tree.match({ tag: 'vtex:contentPlaceholder' }, node => {
      placeholders.push(node.attrs.id);
    });

    placeholders = placeholders.map(async placeholderId => {
      let placeholder = layout.settings[placeholderId];
      // console.log(placeholder);

      if (placeholder) {
        let allContentsJoined = placeholder.map(object =>
          object.content.map(
            async content =>
              await convertVTEXPlaceholderContentType({
                request,
                data: content,
                placeholder: object
              })
          )
        );

        return await Promise.all(allContentsJoined.flat());
      } else {
        return '';
      }
    });

    let rawPlaceholders = await Promise.all(placeholders);

    console.log(rawPlaceholders);

    // let parsedPlaceholders = rawPlaceholders.map( content => posthtmlParser(content.join('')) );

    resolve('');
  });
};

module.exports = async args => {
  let { layout } = args;

  if (args) {
    let htmlFile = await fs.readFileSync(
      path.resolve(process.env.VTEX_CONTENT, 'templates', layout.template + '.html'),
      'utf8'
    );

    let parsedHTML = await posthtml([postHtmlVtex({ request, layout })]).process(htmlFile, {
      xmlMode: true,
      directives: [{ name: 'vtex:', start: '<', end: '/>' }]
    });

    return {
      ...args,
      data: parsedHTML.html
    };
  }

  return args;
};
