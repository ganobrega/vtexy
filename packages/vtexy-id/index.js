const transformerProxy = require('transformer-proxy');
const consola = require('consola');
const chalk = require('chalk');
const { readFileSync } = require('fs');
const path = require('path');

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

module.exports = transformerProxy((data, request, response) => {
  if (process.env.VTEX_TOKENID === undefined) {
    let cookies = parseCookies(request);

    if (cookies['VtexIdclientAutCookie']) {
      process.env.VTEX_TOKENID = cookies['VtexIdclientAutCookie'];

      if (process.env.VTEX_TOKENID) {
        process.env.VTEX_TOKENID = 'VtexIdclientAutCookie=' + process.env.VTEX_TOKENID;
        // consola.success(`Tracking Authentication Cookie`);
      }

      return new Promise(async resolve => {
        resolve(Buffer.from(await readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf8'), 'utf8'));
      });
    } else {
      return data;
    }
  } else {
    return data;
  }
});
