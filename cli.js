#!/usr/bin/env node

const meow = require('meow');
const { cosmiconfigSync } = require('cosmiconfig');
const { pick } = require('lodash');
const trimNewlines = require('trim-newlines');
const redent = require('redent');
const yup = require('yup');

const { optionSchema, storage, i18n, useLocaleSync } = require('./shared');
const Vtexy = require('.');

let options = {
  autoHelp: false,
  flags: {
    account: {
      type: 'string',
      alias: 'a'
    },
    contentBase: {
      type: 'string',
      alias: 'dir'
    },
    locale: {
      type: 'string',
      alias: 'lang'
    },
    help: {
      type: 'boolean',
      alias: 'h'
    }
  }
};

const cli = meow(false, options);

let showHelp = () => {
  let text = `
    ${i18n.__('cli.usage')}
    $ vtexy <${i18n.__('command')}>
        
    ${i18n.__('cli.commands')}
      start     ${i18n.__('cli.start.description')}
      init      ${i18n.__('cli.init.description')}
      pull      ${i18n.__('cli.pull.description')}
      push      ${i18n.__('cli.push.description')}
    
    Options
      --account, -a <account>      ${i18n.__('cli.options.account.description')}
      --locale, -lang <en,pt>      ${i18n.__('cli.options.locale.description')}
      --content-base, -dir <path>  ${i18n.__(
        'cli.options.contentBase.description'
      )}
      --help, -h                   ${i18n.__('cli.options.help.description')}
      --version, -v                ${i18n.__('cli.options.version.description')}
  `;

  let help = redent(trimNewlines((text || '').replace(/\t+\n*$/, '')), 2);

  console.log(help);
};

(async () => {
  if (cli.flags.locale) {
    await useLocaleSync(cli.flags.locale);
  }

  if (cli.flags.help) {
    showHelp();

    process.exit(2);

    return;
  }

  try {
    const explorer = cosmiconfigSync('vtexy');
    let options = await explorer.search();

    if (options && options.filepath) {
      options.configPath = options.filepath;
    }

    try {
      options = await optionSchema.validateSync(
        {
          ...options,
          ...cli.flags
        },
        { stripUnknown: true }
      );
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }

    let vtexy = new Vtexy(options);

    let command = cli.input[0];

    let tasks = {
      init() {
        vtexy.init();
      },

      start() {
        vtexy.start();
      },

      pull() {
        vtexy.data.pull();
      },

      push() {
        vtexy.data.push();
      }
    };

    let run = tasks[command];

    if (run !== undefined) {
      run();
    } else {
      console.log(i18n.__('errors.invalid_command'));
      console.log(`Use: 'vtexy -h' to see usage commands`);
    }
  } catch (error) {
    console.error(error);
  }
})();
