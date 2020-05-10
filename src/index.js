const consola = require('consola');
const terminalLink = require('terminal-link');
const chalk = require('chalk');
const path = require('path');

const { config, i18n } = require('./shared');

function VTEXY(opts) {
  if (opts === null || Object.keys(opts).length === 0) {
    console.error(i18n.__('errors.config_not_found'));
    process.exit(0);
  }

  global.VTEXY = {
    account: opts.account,
    baseDirPath: opts.baseDir,
    locale: config.get('locale'),
    dataPath: path.join(opts.baseDir, 'data'),
    contentPath: path.join(opts.baseDir, 'dist'),
    disableBackend: opts.disableBackend,
    configPath: opts.configPath,
    runtime: {
      dataTree: null,
      contentTree: null
    }
  };

  return VTEXY.prototype;
}

VTEXY.prototype.start = async function() {
  await server();
};

// VTEXY.prototype.init = async function() {};

module.exports = VTEXY;
