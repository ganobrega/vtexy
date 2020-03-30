const fs = require('fs');
const path = require('path');
const JSONC = require('jsonc');
const glob = require('glob');

module.exports = async ({ isMobile, isTablet, ...args }) => {
  let dirs = await glob.sync(path.resolve(process.env.VTEXY_DATA, 'sites/*/_.jsonc'), {});

  let websiteList = dirs.map(file => ({
    path: path.resolve(file, '../'),
    file: path.resolve(file),
    ...JSONC.parse(fs.readFileSync(file, 'utf8'))
  }));

  let websites = await websiteList;

  let mainSite = websites.find(website => website.parent === '' || website.parent === undefined);

  let currentSite;

  if (isMobile && mainSite.mobile) {
    currentSite = websites.find(x => x.id === mainSite.mobile);
  } else if (isTablet && mainSite.tablet) {
    currentSite = websites.find(x => x.id === mainSite.tablet);
  } else {
    currentSite = mainSite;
  }

  return {
    ...args,
    website: currentSite
  };
};
