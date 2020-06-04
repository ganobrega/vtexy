const redent = require('redent');
const trimNewLines = require('trim-newlines');

module.exports = (text, spaces = 0) =>
  redent(trimNewLines((text || '').replace(/\t+\n*$/, '')), spaces);
