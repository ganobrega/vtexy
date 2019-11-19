"use strict";

const express = require("express");
const app = express();
const routes = require("./routes");

app.use("/vtex-legacy-api/");

app.listen(3030, () => {
  console.log("Listening to 3030");
});

// /**
//  * @param html
//  * @param fetch
//  */
// module.exports = function(store, endpoint) {
//   let url = `${store}.vtexcommercestable.com.br/${endpoint}`;

// };
