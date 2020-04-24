const pPipe = require('p-pipe');

// Pipes
const getWebsites = require('./getWebsites');
const mapWebsiteContent = require('./mapWebsiteContent');
const mapWebsiteFolders = require('./mapWebsiteFolders');

const consol = pipe => {
  console.log(pipe);
};

module.exports = async function(api) {
  let pipeline = pPipe(
    getWebsites, //
    consol
    // mapWebsiteContent,
    // mapWebsiteFolders
  );

  return await pipeline({ api });
};
