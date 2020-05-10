const pPipe = require('p-pipe');

const identifyWebsite = require('./identifyWebsite');
const findLayout = require('./findLayout');
const parseTemplate = require('./parseTemplate');

module.exports = async function(data, request, response) {
  let pipeline = pPipe(identifyWebsite /*findLayout, parseTemplate*/);

  return await pipeline({ request, response, data });
};
