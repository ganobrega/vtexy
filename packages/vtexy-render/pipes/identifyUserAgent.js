module.exports = async args => {
  let { request, data } = args;

  let _device = require('device')(request.headers['user-agent']);

  let isMobile = _device.is('phone');
  let isTablet = _device.is('tablet');
  let isDesktop = _device.is('desktop');
  // let isTv = _device.is('tv');
  // let isBot = _device.is('bot');
  // let isCar = _device.is('car');
  // let isConsole = _device.is('console');

  return {
    ...args,
    isMobile,
    isTablet,
    isDesktop
  };
};
