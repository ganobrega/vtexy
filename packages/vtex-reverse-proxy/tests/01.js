require("dotenv").config();

const vtexReverseProxy = require('../.');

vtexReverseProxy(process.env.VTEX_STORE);