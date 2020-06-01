const httpProxy = require('http-proxy');
const path = require('path');
const proxy = httpProxy.createProxyServer({});

module.exports = {
  name: 'VTEX UI',
  plugin(opts, bs) {
    bs.addMiddleware('/vtexy', (req, res) => {
      return proxy.web(req, res, { target: 'http://localhost:4000' });
    });

    require('./server').start(bs, () => {
      bs.publicInstance.watch(
        [
          path.join(global.VTEXY.contentPath, '**/*'),
          path.join(global.VTEXY.dataPath, '**/*')
        ],
        () => {
          require('./server').reload(bs);
        }
      );
    });
  }
};
