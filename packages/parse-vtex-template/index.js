"use strict";

const html5Parser = require("html5parser");

function normalizeVtexTagName(text) {
  return text.toLowerCase().replace("vtex:", "");
}

/**
 * @param html
 * @param fetch
 */
module.exports = function(html, fetch) {
  const ast = html5Parser.parse(html);

  let doc = html.split("");

  html5Parser.walk(ast, {
    enter: node => {
      if (
        node.type === html5Parser.SyntaxKind.Tag &&
        node.name.indexOf("vtex:") >= 0
      ) {
        let id = node.attributes.find(x => x.name.value === "id").value.value;

        if (fetch[node.name] === undefined) {
          return;
        }

        let part = fetch[node.name][id].content.map(x => x.content).join("");

        doc.splice(node.start, node.open.value.length, part);
      }
    }
  });

  return doc.join("");
};
