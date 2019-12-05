const browserSync = require('browser-sync');
const enquirer = require('enquirer');

module.exports = class {
  constructor(props) {
    console.log(props);

    this.config = props;
  }

  get data() {
    let me = this;

    return {
      pull() {
        console.log(me.config);

        console.log('Vtexy -> Pull');
        console.log(`Pulling data...`);
      },
      push() {
        console.log('Vtexy -> Push');
        console.log(`Pushing data...`);
      }
    };
  }

  async init() {
    console.log('Vtexy -> Init');
    // const { prompt } = require('enquirer');

    // const response = await prompt({
    //   type: 'input',
    //   name: 'account',
    //   message: 'Whats is your account?'
    // });
  }

  async start() {
    console.log('Vtexy -> Start');

    const VTEX_DOMAIN = ['vtexcommercestable.com.br', 'myvtex.com'];

    const VTEX_HOST = domain =>
      `${this.config.account}.${VTEX_DOMAIN[domain] || domain}`;

    await browserSync({
      open: 'external',
      https: true,
      watch: true,
      host: VTEX_HOST('vtexlocal.com.br'),
      proxy: `https://${VTEX_HOST(0)}`,
      files: [`${this.config.serveDir}/**/*`],
      serveStatic: [
        {
          route: '/arquivos',
          dir: `${this.config.serveDir}/arquivos`
        },
        {
          route: '/files',
          dir: `${this.config.serveDir}/files`
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
  }
};
