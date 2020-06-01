const path = require('path');
const device = require('device');
const queryString = require('query-string');
const R = require('ramda');

const findValueDeep = require('deepdash/findValueDeep');

module.exports = async args =>
  new Promise((resolve, reject) => {
    let { request } = args;

    const queryParams = queryString.parseUrl(request.url).query;

    let currentDevice;

    // Bypass
    if (queryParams.uam) {
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

    let website = findValueDeep(
      global.VTEXY.runtime.dataTree.sites,
      (item, key, parentValue, context) => {
        if (item.type == 'website' && item.ua == currentDevice) {
          item.children = parentValue.children.find(
            x => x.type == 'directory'
          ).children;
          return true;
        }
        return false;
      },
      { childrenPath: 'children', leavesOnly: true }
    );

    setTimeout(() => {
      // if (website == undefined) {
      //   website = _.findValueDeep(
      //     global.VTEXY.runtime.dataTree.sites,
      //     item => item.type == 'website' && item.ua == 'desktop',
      //     { childrenPath: 'children', leavesOnly: true }
      //   );
      // }

      console.log({ website });

      // console.log(global.VTEXY.runtime.dataTree.sites);

      resolve({
        ...args,
        website
      });
    }, 2);

    // website.children = [
    //   _.findValueDeep(
    //     global.VTEXY.runtime.dataTree.sites,
    //     x => {
    //       console.log(x.path);
    //       return x !== undefined && x.path == path.resolve(website.path, '../_');
    //     },
    //     { childrenPath: 'children' }
    //   )
    // ];
  });
