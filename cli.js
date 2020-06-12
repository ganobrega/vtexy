#!/usr/bin/env node

const meow = require('meow');
const { cosmiconfigSync } = require('cosmiconfig');
const { optionSchema, i18n, useLocaleSync } = require('./src/shared');
const redent = require('redent');
const trimNewLines = require('trim-newlines');
const VTEXYCore = require('./src');
const redentBanner = require('./src/utils/redentBanner');

const pkg = require('./package.json');

// process.nextTick(function memory() {
//   const used = process.memoryUsage();
//   console.log(`Memory: ${Math.round((used.rss / 1024 / 1024) * 100) / 100} MB`);

//   setTimeout(memory, 10000);
// });

const options = {
  autoHelp: false,
  flags: {
    account: {
      type: 'string',
      alias: 'a'
    },
    baseDir: {
      type: 'string',
      alias: 'd'
    },
    noSSR: {
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

const cli = meow('', options);

const showHelp = () => {
  // TODO: Try to use https://www.npmjs.com/package/command-line-usage

  let text = `
    ${i18n.__('cli.Usage')}
    $ vtexy <${i18n.__('command')}> <${i18n.__('options')}>
        
    ${i18n.__('cli.Commands')}
      start            ${i18n.__('cli.start.description')}
      init <path>      ${i18n.__('cli.init.description')}
    
    ${i18n.__('cli.Options')}
      --account, -a <account>      ${i18n.__('cli.flags.account.description')}
      --base-dir, -dir <path>      ${i18n.__('cli.flags.baseDir.description')}
      --no-ssr                     ${i18n.__('cli.flags.noSSR.description')}
      
      --locale <en,pt>             ${i18n.__('cli.flags.locale.description')}
      --help, -h                   ${i18n.__('cli.flags.help.description')}
      --version, -v                ${i18n.__('cli.flags.version.description')}
  `;

  let help = redentBanner(text, 0);

  console.log(help);
};

const showVersion = () => {
  console.log(pkg.version);
};

(async () => {
  if (cli.flags.locale) {
    await useLocaleSync(cli.flags.locale);
    process.exit(2);
  }

  if (cli.flags.help || process.argv[2] === undefined) {
    showHelp();
    process.exit(2);
  }

  if (cli.flags.version) {
    showVersion();
    process.exit(2);
  }

  try {
    async function charger() {
      const explorer = cosmiconfigSync('vtexy');
      const cf = await explorer.search();

      let options = {
        ...cli.flags,
        ...(cf ? cf.config : null),
        ...(cf ? { configPath: cf.filepath } : null)
      };

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

        return options;
      } catch (error) {
        console.error(error.message);
        process.exit(1);
      }
    }

    let vtexy = VTEXYCore(charger);

    let tasks = {
      async init() {
        await vtexy.init();
      },

      async start() {
        await vtexy.charge();
        await vtexy.start();
      }

      // async sync() {}
    };

    let run = tasks[cli.input[0]];

    if (run !== undefined) {
      await run();
    } else {
      console.log(i18n.__('errors.invalid_command'));
      console.log(`Use: 'vtexy -h' to see usage commands`);
    }
  } catch (error) {
    console.error(error);
  }
})();
