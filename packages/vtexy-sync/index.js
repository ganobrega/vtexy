/*const url = require('url');
const request = require('request');
const cheerio = require('cheerio');

module.exports = function(req, res, next) {
  let isAcceptTextHtml = req.headers.accept.indexOf('text/html') >= 0;
  let isSecFetchModeNavigate = req.headers['sec-fetch-mode'] == 'navigate';
  let lid = url.parse(req.url, true).query.lid;

  if (isAcceptTextHtml && isSecFetchModeNavigate && lid) {
    getLayout({ lid }, req, res);
  }

  next();
};

function getLayout(args, req, res) {
  console.log(args.lid);

  let options = {
    url: `https://${process.env.VTEXY.account}.vtexcommercestable.com.br/admin/a/PortalManagement/LayoutContent?layoutId=${args.lid}`,
    method: 'POST',
    headers: {
      Cookie: req.headers.cookie
    }
  };

  request(options, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    // vtex-placeholder-container placeHolderClass

    let $ = cheerio.load(body);
    let $containers = $('span.vtex-placeholder-span');
    // let $placeholders = $('.vtex-placeholder-container.placeHolderClass');

    let containers = [];

    $containers.map((i, el) => {
      let id = $(el)
        .find('a')
        .attr('onclick');
      id = id.replace("AddControl('", '').replace("');", '');

      let name = $(el)
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .trim();

      containers.push({ id: id, name: name, objects: [] });
    });

    console.log(containers);

    // containers = containers.map(container => {
    //   let $container = $('#' + container.id);

    //   let objects = $container.find('.fieldSelected').map(object => {
    //     let instanceid = $(el)
    //       .find('a')
    //       .attr('onclick');

    //       let type = $()

    //     id = id.replace("AddControl('", '').replace("');", '');

    //   });
    // });

    // console.log(body);
  });
}

// function extractPlaceholderIDFromAnchor(el) {
//   let $ = cheerio.load(el);

//   console.log($('a').attr('onclick'));
//   console.log($.attr('onclick'));
// }

function getComponentContent(args, req, res) {
  console.log(args.id);

  let options = {
    url: `https://${process.env.VTEXY.account}.vtexcommercestable.com.br/admin/a/PortalManagement/LayoutContent?layoutId=${args.id}`,
    method: 'POST',
    headers: {
      Cookie: req.headers.cookie
    }
  };

  request(options, (err, res, body) => {
    if (err) {
      return console.log(err);
    }

    console.log(body);
  });
}

// function getWebSiteList(req, res) {
//   let response = request(
//     {
//       url: `https://${process.env.VTEXY.account}.vtexcommercestable.com.br/admin/a/PortalManagement/GetWebSiteList`,
//       method: 'POST',
//       headers: {
//         Cookie: req.headers.cookie
//       }
//     },
//     (err, res, body) => {
//       if (err) {
//         return console.log(err);
//       }

//       let $ = cheerio.load(body);
//       let $list = $('.jqueryFileTreeBody li.web-site > div');

//       let output = [];

//       $('.jqueryFileTreeBody li.web-site > div').map((i, el) => {
//         let name = $(el)
//           .text()
//           .trim();

//         output.push({
//           name
//         });
//       });

//       console.log(output);

//       return output;
//     }
//   );
// }
*/
