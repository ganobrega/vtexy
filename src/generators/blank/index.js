const prompts = require('prompts');
const chalk = require('chalk');
const consola = require('consola');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const cpy = require('cpy');
const execa = require('execa');
const redentBanner = require('../../utils/redentBanner');

module.exports = async input => {
  input =
    input === undefined
      ? process.cwd()
      : path.isAbsolute(input)
      ? input
      : path.join(process.cwd(), input);

  const response = await prompts([
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
    },
    {
      type: 'toggle',
      name: 'useNpm',
      message: 'What package manager you prefer?',
      active: 'npm',
      inactive: 'yarn',
      initial: 0
    }
    // {
    //   type: 'select',
    //   name: 'configType',
    //   message: 'What format do you want your config file to be in?',
    //   choices: [
    //     { title: '.vtexyrc', value: '.vtexyrc' },
    //     { title: 'JSON', value: 'json' },
    //     { title: 'package.json', value: 'pkg' }
    //   ],
    //   initial: 0
    // }
  ]);

  console.log('');
  consola.info(
    `${chalk.bold('ATTENTION:')} After confirm it will create the follow files.`
  );

  const confirm = await prompts({
    type: 'confirm',
    name: 'proceed',
    message: 'Confirm to proceed'
  });

  if (!confirm.proceed) {
    process.exit(1);
    return;
  }

  const files = await glob.sync(path.join(__dirname, 'template', '**/*'), {
    nodir: true
  });

  await cpy(['**/*'], input, {
    parents: true,
    cwd: path.join(__dirname, 'template')
  });

  files.map(file => {
    let newPath = file.replace(path.join(__dirname, 'template'), input);
    console.log(`${chalk.bold.greenBright('CREATED:')} ${newPath}`);
  });

  console.log(response);

  // package.json
  let pkg = {};
  let pkgManager = response.useNpm ? 'npm' : 'yarn';

  if (!fs.existsSync(path.join(input, 'package.json'))) {
    await execa(pkgManager, ['init', '-y'], { cwd: input }).stdout.pipe(
      process.stdout
    );
  }

  await execa(pkgManager, [response.useNpm ? 'i' : 'add', 'vtexy', '-D'], {
    cwd: input
  })
    .on('close', async code => {
      if (code === 0) {
        pkg = JSON.parse(
          await fs.readFileSync(path.join(input, 'package.json'), 'utf8')
        );

        pkg.scripts = {
          ...(pkg.scripts ? pkg.scripts : null),
          dev: 'vtexy start'
        };

        pkg.vtexy = {
          account: response.account,
          baseDir: './'
        };

        console.log(JSON.stringify(pkg, null, 2));

        await fs.writeFile(
          path.join(input, 'package.json'),
          JSON.stringify(pkg, null, 2),
          'utf8',
          err => {
            if (!err) {
              console.log(
                `${chalk.bold.greenBright('CREATED:')} ${path.join(
                  input,
                  'package.json'
                )}`
              );
            }
          }
        );
      }
    })
    .stdout.pipe(process.stdout);
};
