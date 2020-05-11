const execa = require('execa');
const path = require('path');

module.exports = async () => {
  await execa('cp', [
    '-R',
    path.resolve(__dirname, 'dist'),
    path.resolve(global.VTEXY.baseDirPath)
  ]);
  await execa('cp', [
    '-R',
    path.resolve(__dirname, 'data'),
    path.resolve(global.VTEXY.baseDirPath)
  ]);
  await execa('cp', [
    path.resolve(__dirname, 'vtexy.config.js'),
    path.resolve(global.VTEXY.baseDirPath)
  ]);
};
