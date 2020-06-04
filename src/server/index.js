const path = require('path');
const consola = require('consola');
const terminalLink = require('terminal-link');
const chalk = require('chalk');
const browserSync = require('browser-sync');

const { print, i18n } = require('../shared');
const vtexyRenderMiddleware = require('./middlewares/render/middleware');
const preload = require('./preload');
const vtexyUIPlugin = require('./plugins/ui');

module.exports = async () => {
  print(i18n.__('core.start.0'));
  // consola.info(
  //   `Local Server Side Rendering is ${
  //     global.VTEXY.disableBackend
  //       ? chalk.red('disabled')
  //       : chalk.green('enabled')
  //   }`
  // );

  var bs = browserSync.create();

  if (global.VTEXY.noSSR) {
    print(`The SSR is ${chalk.redBright('disabled')}`);
  } else {
    await preload.loadAll();
    bs.watch(path.join(global.VTEXY.dataPath, '**/*')).on('change', () =>
      (async () => {
        await preload.loadDataTree();
      })()
    );

    bs.watch(path.join(global.VTEXY.contentPath, '**/*')).on('change', () =>
      (async () => {
        await preload.loadContentTree();
      })()
    );
  }

  bs.emitter.on('init', bsInstance => {
    let [name, link] = Array.from(bsInstance.options.get('urls'))[1];

    name = name.charAt(0).toUpperCase() + name.slice(1);

    print(`${i18n.__('core.start.3')} ${chalk.cyanBright.underline(link)}`);

    print(i18n.__('core.start.4')); // Watching changes

    if (!global.VTEXY.disableBackend) {
      bsInstance.addMiddleware('*', vtexyRenderMiddleware);
    }
  });

  bs.init({
    // Enabled
    watch: true,
    https: true,
    online: true,

    // Disabled
    open: false,
    ui: false,
    minify: false,
    logFileChanges: false,
    notify: false,
    reloadOnRestart: false,

    // Configurations
    logLevel: 'silent',
    logPrefix: 'VTEXY',
    host: `${global.VTEXY.account}.vtexlocal.com.br`,
    proxy: `https://${global.VTEXY.account}.vtexcommercestable.com.br`,
    files: [path.resolve(global.VTEXY.contentPath, 'static/**/*')],

    // plugins: [vtexyUIPlugin],

    serveStatic: [
      {
        route: '/arquivos',
        dir: path.resolve(global.VTEXY.contentPath, 'static')
      },
      {
        route: '/files',
        dir: path.resolve(global.VTEXY.contentPath, 'static')
      }
    ],

    snippetOptions: {
      rule: {
        match: /(<\/body>|<\/pre>)/i,
        fn: function(snippet, match) {
          return snippet + match;
        }
      }
    }
  });
};
