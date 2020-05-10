const path = require('path');
const consola = require('consola');
const terminalLink = require('terminal-link');
const chalk = require('chalk');
const browserSync = require('browser-sync');

const vtexyRenderMiddleware = require('./middleware');
const preload = require('./preload');

module.exports = async () => {
  await preload.loadAll();

  var bs = browserSync.create();

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

  bs.emitter.on('init', bsInstance => {
    Array.from(bsInstance.options.get('urls')).map(item => {
      let link = terminalLink(item[1], item[1], {
        fallback: () => item[1]
      });
      let name = item[0];
      let nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);

      consola.info(`${nameCapitalized} ${chalk.underline(link)}`);
    });

    if (!global.VTEXY.disableBackend) {
      bsInstance.addMiddleware('*', vtexyRenderMiddleware);
    }

    consola.info(
      `Local Server Side Rendering is ${
        global.VTEXY.disableBackend
          ? chalk.red('disabled')
          : chalk.green('enabled')
      }`
    );
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
    files: [
      path.resolve(global.VTEXY.contentPath, 'dist/arquivos/**/*'),
      path.resolve(global.VTEXY.contentPath, 'dist/files/**/*')
    ],

    middleware: [],

    serveStatic: [
      {
        route: '/arquivos',
        dir: path.resolve(global.VTEXY.contentPath, 'arquivos')
      },
      {
        route: '/files',
        dir: path.resolve(global.VTEXY.contentPath, 'files')
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
