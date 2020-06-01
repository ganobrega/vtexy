const { print } = require('../../../../shared');
const express = require('express');
const path = require('path');
const chalk = require('chalk');
var serveIndex = require('serve-index');

const app = express();

const publicPath = path.join(__dirname, 'public');

module.exports = {
  reload(bs) {
    console.log('reload');
    // Debounce
    // setTimeout(() => {
    //   app.close();
    //   this.start(bs);
    // }, 4000);
  },
  start(bs, afterMount) {
    // app.get('/', (req, res) => {
    //   res.sendFile(path.join(publicPath + '/index.html'));
    // });
    // app.use('/', serveIndex(publicPath)); // Do not use it with the res.sendFile above

    app.get('/api/runtime', (req, res) => {
      res.json(global.VTEXY.runtime);
    });

    app.use(express.static(publicPath));

    app.listen(4000, () => {
      let [name, link] = Array.from(bs.options.get('urls'))[1];

      name = name.charAt(0).toUpperCase() + name.slice(1);

      print(
        `Acesse o painel VTEXY em ${chalk.cyanBright.underline(
          `${link}/vtexy`
        )}`
      );

      // setTimeout(() => {
      //   afterMount();
      // }, 1000);
    });
  }
};
