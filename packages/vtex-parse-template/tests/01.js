const parseVtexTemplate = require("../index.js");
const Banner01 = require("./data/Banner 01");

let INPUT = `
<html>

    <body>
        <vtex:contentPlaceHolder id="Banner 01"/>
    </body>

</html>`;


let OUTPUT = parseVtexTemplate(INPUT, {
  "vtex:contentplaceholder": {
    "Banner 01": Banner01
  }
});
    
console.log('INPUT: ', INPUT);
console.log('\n\n\n');
console.log('OUTPUT: ', OUTPUT);
