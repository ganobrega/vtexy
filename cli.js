#!/usr/bin/env node

const meow = require('meow');
const { cosmiconfigSync } = require('cosmiconfig');
const { optionSchema, i18n, useLocaleSync } = require('./shared');
// const figlet = require('figlet');

let options = {
  autoHelp: false,
  flags: {
    account: {
      type: 'string',
      alias: 'a'
    },
    baseDir: {
      type: 'string',
      alias: 'dir'
    },
    disableBackend: {
      type: 'boolean'
    },
    locale: {
      type: 'string'
    },
    help: {
      type: 'boolean',
      alias: 'h'
    },
    version: {
      type: 'boolean',
      alias: 'v'
    }
  }
};

const cli = meow(false, options);

const showHelp = () => {
  let text = `
    ${i18n.__('cli.usage')}
    $ vtexy <${i18n.__('command')}> <${i18n.__('options')}>
        
    ${i18n.__('cli.commands')}
      start     ${i18n.__('cli.start.description')}
      init      ${i18n.__('cli.init.description')}
      pull      ${i18n.__('cli.pull.description')}
      push      ${i18n.__('cli.push.description')}
    
    Options
      --account, -a <account>      ${i18n.__('cli.flags.account.description')}
      --locale <en,pt>             ${i18n.__('cli.flags.locale.description')}
      --base-dir, -dir <path>      ${i18n.__('cli.flags.baseDir.description')}
      --disable-backend            ${i18n.__('cli.flags.disableBackend.description')}
      --help, -h                   ${i18n.__('cli.flags.help.description')}
      --version, -v                ${i18n.__('cli.flags.version.description')}
  `;

  let help = require('redent')(require('trim-newlines')((text || '').replace(/\t+\n*$/, '')), 2);

  console.log(help);
};

const showVersion = () => {
  console.log(require('./package.json').version);
};

(async () => {
  // console.log(figlet.textSync('Vtexy', { font: 'Roman' }));

  if (cli.flags.locale) {
    await useLocaleSync(cli.flags.locale);
    process.exit(2);
  }

  if (cli.flags.help) {
    showHelp();
    process.exit(2);
  }

  if (cli.flags.version) {
    showVersion();
    process.exit(2);
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
          ...(options ? options.config : null),
          ...(options ? options : null),
          ...cli.flags
        },
        { stripUnknown: true }
      );
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }

    let vtexy = require('.')(options);

    let tasks = {
      init() {
        vtexy.init();
      },

      start() {
        vtexy.start();
      }

      // pull() {
      //   vtexy.data.pull();
      // },

      // push() {
      //   vtexy.data.push();
      // }
    };

    let run = tasks[cli.input[0]];

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
