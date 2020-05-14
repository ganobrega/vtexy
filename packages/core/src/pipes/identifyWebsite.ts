import VTEXYCore = require('../types');

import path from 'path';
import queryString from 'query-string';
import device from 'device';

const findValueDeep = require('deepdash/getfindValueDeep');

export default async args =>
  new Promise((resolve, reject) => {
    let { request } = args;

    const queryParams = queryString.parseUrl(request.url).query;

    let currentDevice;

    // Bypass
    if (queryParams.uam) {
      if (queryParams.mobile == '4') {
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
      VTEXYCore.runtime.dataTree.sites,
      item => item.type == 'website' && item.ua == currentDevice,
      { childrenPath: 'children', leavesOnly: true }
    );

    setTimeout(() => {
      // if (website == undefined) {
      //   website = findValueDeep(
      //     VTEXYCore.runtime.dataTree.sites,
      //     item => item.type == 'website' && item.ua == 'desktop',
      //     { childrenPath: 'children', leavesOnly: true }
      //   );
      // }

      console.log(website);

      // console.log(VTEXYCore.runtime.dataTree.sites);

      resolve({
        ...args,
        website
      });
    }, 2);

    // website.children = [
    //   findValueDeep(
    //     VTEXYCore.runtime.dataTree.sites,
    //     x => {
    //       console.log(x.path);
    //       return x !== undefined && x.path == path.resolve(website.path, '../_');
    //     },
    //     { childrenPath: 'children' }
    //   )
    // ];
  });