require("dotenv").config();

var browserSync = require("browser-sync");


const VTEX_DOMAIN = ["vtexcommercestable.com.br", "myvtex.com"];
const VTEX_HOST = domain => `${process.env.VTEX_STORE}.${VTEX_DOMAIN[domain] || domain}`;

browserSync({
  https: true,
  watch: true,
  host: VTEX_HOST('vtexlocal.com.br'),
  proxy: `https://${VTEX_HOST(0)}`,
  files: ['dist/**/*'],

  middleware: [
    {
      route: '/',
      handle: function (req, res, next) {
        // console.log(req._parsedUrl);
        next();
      }
    }
],

  serveStatic: [
    {
      route: "/arquivos",
      dir: "dist/arquivos"
    },
    {
      route: "/files",
      dir: "dist/files"
    }
  ],
  // rewriteRules: [
  //   {
  //       match: /http\:\/\/localhost\:3002/g,
  //       fn: function (req, res, match) {
  //           return 'https://localhost:3002';
  //       }
  //   }
  // ],
  snippetOptions: {
    // rule: {
    //   match: /(.*\.localhost\:.*\/api\/vtex)/i,
    //   fn: function(snippet, match) {
    //     return VTEX_HOST(1);
    //   }
    // },

    rule: {
      match: /(<\/body>|<\/pre>)/i,
      fn: function(snippet, match) {
        return snippet + match;
      }
    }
  }
});

