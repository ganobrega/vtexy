#!/usr/bin/env node

const meow = require('meow');
const { cosmiconfigSync } = require('cosmiconfig');
const { pick } = require('lodash');
const trimNewlines = require('trim-newlines');
const redent = require('redent');

const {
  defaultConfigsSchema,
  storage,
  i18n,
  useLocaleSync
} = require('./shared');
const Vtexy = require('.');

let options = {
  autoHelp: false,
  flags: {
    account: {
      type: 'string',
      alias: 'a'
    },
    serveDir: {
      type: 'string',
      alias: 's'
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
    let config = await explorer.search();

    config = pick(
      {
        ...config,
        ...cli.flags
      },
      defaultConfigsSchema
    );

    let vtexy = new Vtexy(config);

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
