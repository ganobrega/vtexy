const cheerio = require('cheerio');
const { stripPunctuation } = require('string-fn');

module.exports = async ({ websites, ...pipe }) => {
  let { api } = pipe;

  websites = websites.map(async ({ id, rel }) => {
    let response = await api.post(`/admin/a/PortalManagement/WebSiteContent?WebSiteId=${stripPunctuation(id)}`);

    const $ = await cheerio.load(response.data);

    let data = {
      id,
      name: $('#Name').val(),
      parent: $('#ParentId option[selected]').val() || '',
      mobile: $('#MobileWebSiteId option[selected]').val() || '',
      tablet: $('#TabletWebSiteId option[selected]').val() || '',
      routes: [{ name: '_', rel: rel }]
    };

    return data;
  });

  websites = await Promise.all(websites);

  return {
    websites,
    ...pipe
  };
};
