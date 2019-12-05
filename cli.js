#!/usr/bin/env node

const meow = require('meow');
const { cosmiconfigSync } = require('cosmiconfig');
const { pick } = require('lodash');

const { defaultConfigs } = require('./shared');
const Vtexy = require('.');

let options = {
  flags: {
    account: {
      type: 'string',
      alias: 'a'
    },
    serveDir: {
      type: 'string',
      alias: 's'
    }
  }
};

const cli = meow(
  `
	Usage
  $ vtexy <command>
      
  Commands
    start     Start local development
    init      Create a vtexy configuration file
    pull      Pull data from remote VTEX to local
    push      Push data from local to remote VTEX
    
`,
  options
);

(async () => {
  try {
    const explorer = cosmiconfigSync('vtexy');
    let config = explorer.search();

    config = pick(
      {
        ...config,
        ...cli.flags
      },
      defaultConfigs
    );

    if (config === null || Object.keys(config).length === 0) {
      throw 'Missing a vtexy file/virtual configuration';
    }

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
      throw 'Invalid command';
    }
  } catch (error) {
    console.error(error);
  }
})();
