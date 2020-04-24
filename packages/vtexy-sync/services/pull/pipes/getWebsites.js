const cheerio = require('cheerio');
const querystring = require('querystring');
const { toUUID } = require('to-uuid');

module.exports = async pipe => {
  let { api } = pipe;

  let response = await api.post(`/admin/a/PortalManagement/FolderContent`, querystring.stringify({ dir: 'sites:/' }));

  const $ = await cheerio.load(response.data);

  let websites = [];

  $('.jqueryFileTree li.directory.web-site').map((i, el) => {
    let id = toUUID(
      $(el)
        .find('a')
        .attr('rel')
        .replace('/', '')
        .substring(5)
        .split(':')[0]
    );

    let rel = $(el)
      .find('a')
      .attr('rel');

    websites.push({ id, rel });
  });

  return {
    websites,
    ...pipe
  };
};
