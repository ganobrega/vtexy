const fs = require('fs'),
  path = require('path'),
  Conf = require('conf'),
  i18n = require('i18n'),
  chalk = require('chalk'),
  yup = require('yup');

const config = new Conf({
  locale: {
    type: 'string',
    default: 'en'
  }
});

i18n.configure({
  objectNotation: true,
  updateFiles: false,
  defaultLocale: config.get('locale') ? config.get('locale') : 'en',
  locales: ['en', 'pt'],
  directory: path.resolve(__dirname, '..', 'locales'),
  api: {
    __: 't',
    __n: 'tn'
  }
});

const optionSchema = yup.object({
  account: yup.string().required(),
  baseDir: yup
    .string()
    .transform(function(value, originalValue) {
      if (path.isAbsolute(value)) {
        return value;
      } else {
        return path.resolve(process.cwd(), value);
      }
    })
    .default(process.cwd()),
  port: yup.number().default(3000),
  noSSR: yup.boolean().default(false),
  configPath: yup.string()
});

// Methods
const useLocaleSync = async locale => {
  await i18n.setLocale(locale);
  await config.set('locale', locale);
};

const print = text => {
  console.log(`${chalk.grey('vtexy')} ${text.trim()}`);
};

module.exports = {
  optionSchema,
  config,
  i18n,
  useLocaleSync,
  print
};
