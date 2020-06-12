const prompts = require('prompts');
const chalk = require('chalk');
const consola = require('consola');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const cpy = require('cpy');
const { optionSchema } = require('../../shared');

module.exports = async () => {
  const response = await prompts([
    {
      type: 'select',
      name: 'typeOfInstallation',
      message: 'Choose the installation type:',
      choices: [
        { value: 'new', title: 'Create a new folder' },
        { value: 'current', title: 'Setup on current folder' }
      ]
    },
    {
      type: prev => (prev === 'new' ? 'text' : null),
      name: 'pathToNewFolder',
      message: 'Where should the new folder be created?:',
      initial: './my-store',
      validate: val => path.isAbsolute(process.cwd(), val),
      format: val => path.join(process.cwd(), val)
    },
    {
      type: 'text',
      name: 'account',
      message: 'Enter the VTEX account name',
      format: val => val.replace(/([^a-zA-Z0-9]+)/gi, ''),
      validate: val => {
        if (val.length === 0) {
          return `This field must be filled`;
        }

        if (/([^a-zA-Z0-9]+)/.test(val)) {
          return `Please, strip punctuations`;
        }

        return true;
      }
    }
  ]);

  console.log('');
  consola.info(
    `${chalk.bold('ATTENTION:')} After confirm it will create the follow files.`
  );

  const confirm = await prompts({
    type: 'confirm',
    name: 'proceed',
    message: 'Confirm to proceed',
    initial: true
  });

  if (!confirm.proceed) {
    process.exit(1);
    return;
  }

  const clientPath =
    response.typeOfInstallation == 'new'
      ? response.pathToNewFolder
      : process.cwd();

  const files = await glob.sync(path.join(__dirname, 'template', '**/*'), {
    nodir: true
  });

  await cpy(['**/*'], clientPath, {
    parents: true,
    cwd: path.join(__dirname, 'template')
  });

  files.map(file => {
    let newPath = file.replace(path.join(__dirname, 'template'), clientPath);
    console.log(`${chalk.bold.greenBright('CREATED:')} ${newPath}`);
  });

  let vtexyOptions = await optionSchema.validateSync(
    { account: response.account },
    {
      stripUnknown: true
    }
  );

  vtexyOptions.baseDir = './';

  fs.writeFileSync(
    path.join(clientPath, '.vtexyrc.json'),
    JSON.stringify(vtexyOptions, null, 2),
    'utf8'
  );

  console.log(
    `${chalk.bold.greenBright('CREATED:')} ${path.join(
      clientPath,
      '.vtexyrc.json'
    )}`
  );
};
