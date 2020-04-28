const findValueDeep = require('deepdash/findValueDeep');

module.exports = async args => {
  let { request } = args;

  let _device = require('device')(request.headers['user-agent'], {
    unknownUserAgentDeviceType: 'desktop',
    tvUserAgentDeviceType: 'desktop',
    consoleUserAgentDeviceType: 'desktop',
    carUserAgentDeviceType: 'desktop',
    botUserAgentDeviceType: 'desktop'
  });

  let website = findValueDeep(global.vtexyDataTree, item => {
    console.log(item);
    return item.type == 'website' && item.ua === _device.type;
  }).children[0];

  console.log(website);

  // _device.type;

  let isMobile = _device.is('phone');
  let isTablet = _device.is('tablet');
  let isDesktop = _device.is('desktop');
  // let isTv = _device.is('tv');
  // let isBot = _device.is('bot');
  // let isCar = _device.is('car');
  // let isConsole = _device.is('console');

  return {
    ...args,
    website
  };
};
