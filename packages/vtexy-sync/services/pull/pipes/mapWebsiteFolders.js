const cheerio = require('cheerio');
const querystring = require('querystring');

module.exports = async ({ websites, ...pipe }) => {
  let { api } = pipe;

  const getSubFolders = async rel => {
    let response = await api.post(`/admin/a/PortalManagement/FolderContent`, querystring.stringify({ dir: rel }));

    const $ = await cheerio.load(response.data);

    let folders = [];

    $('.directory').map(el => {
      folders.push({ name: $(el).text(), rel: $(el).attr('rel') });
    });

    console.log(folders);

    return folders;
  };

  const recursiveGetSubFolder = async dir => {
    dir.folders = await getSubFolders(dir.rel);

    // if (dir.folders.length > 0) {
    //   await Promise.all(dir.folders.map(async subdir => await recursiveGetSubFolder(subdir)));
    // }

    return dir;
  };

  websites = websites.map(async website => {
    website.routes = await Promise.all(website.routes.map(async dir => recursiveGetSubFolder(dir)));

    return website;
  });

  websites = await Promise.all(websites);

  return {
    websites,
    ...pipe
  };
};
