const path = require('path');
const posthtml = require('posthtml');
const posthtmlParser = require('posthtml-parser');
const Velocity = require('velocityjs');
const slugify = require('slugify');
const axios = require('axios');
const parseCookies = require('../../../../../utils/parseCookies');
const tags = require('./tags');

const api = axios.create({
  // adapter: cache.adapter
});

const postHTMLVtex = ({ layout, cookie }) => tree => {
  return new Promise(async resolve => {
    await tags({ layout, cookie, tree }, resolve);
  });
};

module.exports = async args => {
  let { layout, request } = args;

  if (args) {
    let htmlFile = global.VTEXY.runtime.content.templates.find(
      x => x.name == layout.template + '.html'
    ).content;

    let cookie = parseCookies(request)['VtexIdclientAutCookie'];

    let parsedHTML = await posthtml([
      await postHTMLVtex({ layout, cookie })
    ]).process(htmlFile, {
      xmlMode: true,
      directives: [
        { name: 'vtex:', start: '<', end: '/>' },
        { name: 'vtex.cmc:', start: '<', end: '/>' }
      ]
    });

    return {
      ...args,
      data: parsedHTML.html
    };
  }

  return args;
};
