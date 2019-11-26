// const concurrently = require("concurrently");

// function success(msg){
//     console.log(msg);
// }

// function failure(msg) {
//   console.error(msg);
// }

// concurrently([{ command: "node packages/vtex-proxy/index", name: "vtex-proxy" }], {
//   prefix: "name",
//   killOthers: ["failure", "success"],
//   restartTries: 3
// }).then(success, failure);

const { fork } = require("child_process");

const proxy = fork("@vtexy/vtex-proxy");

console.log(proxy);
