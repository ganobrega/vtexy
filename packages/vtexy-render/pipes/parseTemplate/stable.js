const fs = require('fs');
const path = require('path');
const posthtml = require('posthtml');
const posthtmlParser = require('posthtml-parser');

const convertVTEXPlaceholderContentType = (data, type) => {
  switch (type) {
    case 'banner':
      let img = `<img width="${data.width}" height="${data.height}" id="" alt="${data.name}" src="${data.file}" />`;
      return `<div class="box-banner"><a>${img}</a></div>`;

    case 'html':
      return data.html;

    case 'collection':
      return '';

    case 'bannerhtml':
      return '';

    default:
      break;
  }
};

const postHtmlVtex = context => tree => {
  tree
    .match({ tag: 'vtex:contentPlaceholder' }, node => {
      let placeholder = context.settings[node.attrs.id];

      if (placeholder) {
        let allContentsJoined = placeholder
          .map(object =>
            object.content.map(content => convertVTEXPlaceholderContentType(content, object.type)).join('')
          )
          .join('');

        node = posthtmlParser(allContentsJoined);
      } else {
        node.content = [];
        node.tag = false;
      }

      return node;
    })
    .match({ tag: 'head' }, node => {
      node.content.push(`\n<!-- CommerceContext.Current.VirtualFolder.Name: ${context.virtualFolder} -->\n`);
      return node;
    });
};

module.exports = async ({ layout, ...args }) => {
  if (args) {
    let htmlFile = await fs.readFileSync(
      path.resolve(process.env.VTEXY_CONTENT, 'templates', layout.template + '.html'),
      'utf8'
    );

    let parsedHTML = await posthtml([postHtmlVtex(layout)]).process(htmlFile, {
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
