require("dotenv").config();

const request = require("request");
const cheerio = require("cheerio");

var headers = {
  Cookie: process.env.VTEX_COOKIE
};

let baseURL = `https://${process.env.VTEX_STORE}.vtexcommercestable.com.br`;

request(
  {
    url: `${baseURL}/admin/a/PortalManagement/GetWebSiteList`,
    method: "POST",
    headers
  },
  (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    // console.log(body);
    let $ = cheerio.load(body);
    let $list = $(".jqueryFileTreeBody li.web-site > div");

    let output = [];

    $(".jqueryFileTreeBody li.web-site > div").map((i, el) => {
      // console.log(
      //   $(el)
      //     .text()
      //     .trim()
      // );

      let name = $(el)
        .text()
        .trim();

      output.push({
        name
      });
    });

    console.log(output);
  }
);
