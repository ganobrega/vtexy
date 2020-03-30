const transformerProxy = require('transformer-proxy');

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
    return new Promise(resolve => {
      let cookies = parseCookies(request);
      process.env.VTEX_TOKENID = cookies['VtexIdclientAutCookie'];

      setTimeout(() => {
        resolve(data);
      }, 100);
    });
  } else {
    return data;
  }
});
