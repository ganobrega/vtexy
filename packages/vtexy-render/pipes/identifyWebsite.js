const fs = require('fs');
const path = require('path');
const JSONC = require('jsonc');
const glob = require('glob');
const { WebsiteSchema } = require('../../vtexy-schemas');

module.exports = async ({ isMobile, isTablet, ...args }) => {
  let dirs = await glob.sync(path.resolve(process.env.VTEXY_DATA, 'sites/*/_.jsonc'), {});

  let websiteList = dirs.map(async file => ({
    path: path.resolve(file, '../'),
    file: path.resolve(file),
    ...WebsiteSchema.validate(JSONC.parse(await fs.readFileSync(file, 'utf8')))
  }));

  let websites = await Promise.all(websiteList);

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
