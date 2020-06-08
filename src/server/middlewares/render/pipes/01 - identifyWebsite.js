const path = require('path');
const device = require('device');
const queryString = require('query-string');

const findValueDeep = require('deepdash/findValueDeep');

module.exports = async args =>
  new Promise((resolve, reject) => {
    let { request } = args;

    const queryParams = queryString.parseUrl(request.url).query;

    let currentDevice;

    // Bypass
    if (queryParams.uam == 'true') {
      if (queryParams.mobile == 4) {
        currentDevice = 'mobile';
      }

      if (queryParams.mobile == '3') {
        currentDevice = 'tablet';
      }
    } else {
      let _device = device(request.headers['user-agent'], {
        unknownUserAgentDeviceType: 'desktop',
        tvUserAgentDeviceType: 'desktop',
        consoleUserAgentDeviceType: 'desktop',
        carUserAgentDeviceType: 'desktop',
        botUserAgentDeviceType: 'desktop'
      });

      currentDevice = _device.type;
    }

    let website = global.VTEXY.runtime.data.sites.children
      .find(x =>
        x.children.find(y => y.ua == currentDevice && y.type == 'website')
      )
      .children.find(x => x.type == 'website');

    website.children = global.VTEXY.runtime.data.sites.children
      .find(x =>
        x.children.find(y => y.ua == currentDevice && y.type == 'website')
      )
      .children.find(x => x.type == 'directory' && x.name == 'routes').children;

    // console.log({ website });

    resolve({
      ...args,
      website
    });
  });
