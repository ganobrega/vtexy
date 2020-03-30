const consola = require('consola');
const terminalLink = require('terminal-link');
const chalk = require('chalk');
const path = require('path');

const { storage, i18n } = require('./shared');

function VTEXY(config) {
  if (config === null || Object.keys(config).length === 0) {
    console.error(i18n.__('errors.config_not_found'));
    process.exit(0);
  }

  // VTEX Configurations
  process.env.VTEX_ACCOUNT = config.account;

  // VTEXY Configurations
  process.env.VTEXY_CONFIG = config.configPath;
  process.env.VTEXY_DISABLEBACKEND = config.disableBackend;
  process.env.VTEXY_LOCALE = storage.get('locale');
  process.env.VTEXY_BASEDIR = config.baseDir;
  process.env.VTEXY_DATA = path.join(config.baseDir, 'data');
  process.env.VTEXY_CONTENT = path.join(config.baseDir, 'dist');

  return VTEXY.prototype;
}

VTEXY.prototype.start = async function() {
  await require('browser-sync')({
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
    host: `${process.env.VTEX_ACCOUNT}.vtexlocal.com.br`,
    proxy: `https://${process.env.VTEX_ACCOUNT}.vtexcommercestable.com.br`,
    files: [`${path.join(process.env.VTEXY_CONTENT, 'dist')}/**/*`],

    middleware: [],

    callbacks: {
      ready: function(err, bs) {
        Array.from(bs.options.get('urls')).map(item => {
          let link = terminalLink(item[1], item[1], { fallback: () => item[1] });
          let name = item[0];
          let nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);

          consola.info(`${nameCapitalized} ${chalk.underline(link)}`);
        });

        if (process.env.VTEXY_DISABLEBACKEND == 'false') {
          bs.addMiddleware('*', require('./packages/vtexy-id'));
          bs.addMiddleware('*', require('./packages/vtexy-render'));
        }

        consola.info(
          `Local Server Side Rendering is ${
            process.env.VTEXY_DISABLEBACKEND == 'false' ? chalk.green('enabled') : chalk.red('disabled')
          }`
        );
      }
    },

    serveStatic: [
      {
        route: '/arquivos',
        dir: path.resolve(process.env.VTEXY_CONTENT, 'arquivos')
      },
      {
        route: '/files',
        dir: path.resolve(process.env.VTEXY_CONTENT, 'files')
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

VTEXY.prototype.init = async function() {};

module.exports = VTEXY;
