const fs = require('fs');
const path = require('path');
const posthtml = require('posthtml');
const posthtmlParser = require('posthtml-parser');
const parseCollectionSync = require('./parseCollectionSync');

function parseCookies(request) {
  var list = {},
    rc = request.headers.cookie;

  rc &&
    rc.split(';').forEach(function(cookie) {
      var parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

  return list;
}

const postHTMLVtex = ({ layout, cookie }) => tree => {
  return new Promise(async resolve => {
    // List placeholders id in html template
    let placeholders = [];
    tree.match({ tag: 'vtex:contentPlaceholder' }, node => {
      placeholders.push(node.attrs.id);
      return node;
    });

    // Find properties in layout according to id
    await Promise.all(
      placeholders.map(async id => {
        let placeholder = layout.settings[id];

        let html = await Promise.all(
          placeholder.map(
            async object =>
              await Promise.all(
                object.content.map(async content => {
                  switch (object.type) {
                    case 'banner':
                      return `<div class="box-banner"><a><img width="${content.width}" height="${content.height}" id="" alt="${content.name}" src="${content.file}" /></a></div>`;

                    case 'html':
                      return content.html;

                    case 'collection':
                      return await parseCollectionSync({ content, object, cookie });

                    case 'bannerhtml':
                      return '';

                    default:
                      break;
                  }
                })
              )
          )
        );

        html = html.flat().join('');

        console.log(html);

        tree.match({ tag: 'vtex:contentPlaceholder', attrs: { id } }, node => {
          if (placeholder) {
            node = posthtmlParser(html);
          } else {
            node.content = [];
            node.tag = false;
          }
          return node;
        });
      })
    ).then(() => {
      tree.match({ tag: 'head' }, node => {
        node.content.push(`\n<!-- CommerceContext.Current.VirtualFolder.Name: ${layout.virtualFolder} -->\n`);
        return node;
      });

      resolve(tree);
    });
  });
};

module.exports = async args => {
  let { layout, request } = args;

  if (args) {
    let htmlFile = await fs.readFileSync(
      path.resolve(process.env.VTEXY_CONTENT, 'templates', layout.template + '.html'),
      'utf8'
    );

    let cookie = parseCookies(request)['VtexIdclientAutCookie'];

    let parsedHTML = await posthtml([await postHTMLVtex({ layout, cookie })]).process(htmlFile, {
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
