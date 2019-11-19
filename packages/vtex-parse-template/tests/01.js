const parseVtexTemplate = require("../index.js");
const Banner01 = require("./data/Banner 01");

let tokens = parseVtexTemplate(
  `
    <html>

        <body>
            <vtex:contentPlaceHolder id="Banner 01"/>
        </body>

    </html>`,
  {
    "vtex:contentplaceholder": {
      "Banner 01": Banner01
    }
  }
);

console.log(tokens);
