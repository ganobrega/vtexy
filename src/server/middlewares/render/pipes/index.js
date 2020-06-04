const pPipe = require('p-pipe');

const identifyWebsite = require('./01 - identifyWebsite');
const findLayout = require('./02 - findLayout');
const parseTemplate = require('./03 - parseTemplate');

module.exports = async function(data, request, response) {
  let pipeline = pPipe(identifyWebsite, findLayout, parseTemplate);

  return await pipeline({ request, response, data });
};
