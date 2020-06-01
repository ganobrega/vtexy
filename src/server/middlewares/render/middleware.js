const transformerProxy = require('transformer-proxy');
const pipeline = require('./pipes');

const isContentTypeHTML = contentType =>
  contentType && ~contentType.indexOf('text/html');
const isVTEXClientPage = htmlBody => ~htmlBody.indexOf('xmlns:vtex');

module.exports = transformerProxy((data, request, response) => {
  if (isContentTypeHTML(response._headers['content-type'])) {
    let body = data.toString('utf8');

    // Check if the page is a VTEX Client Page
    if (isVTEXClientPage(body)) {
      return new Promise(async (resolve, reject) => {
        try {
          let _data = await pipeline(body, request, response);
          let buff = Buffer.from(_data.data, 'utf8');

          resolve(buff);
        } catch (error) {
          console.error(error);
          reject(data);
        }
      });
    }
  }

  return data;
});
