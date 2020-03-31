const fs = require('fs'),
  path = require('path'),
  Conf = require('conf'),
  i18n = require('i18n'),
  yup = require('yup');

const storage = new Conf({
  locale: {
    type: 'string',
    default: 'en'
  }
});

i18n.configure({
  objectNotation: true,
  updateFiles: false,
  defaultLocale: storage.get('locale') ? storage.get('locale') : 'en',
  locales: ['en', 'pt'],
  directory: __dirname + '/locales',
  api: {
    __: 't',
    __n: 'tn'
  }
});

const optionSchema = yup.object({
  account: yup.string().required(),
  baseDir: yup.string().default(process.cwd()),
  port: yup.number().default(3000),
  disableBackend: yup.boolean().default(false),
  configPath: yup.string()
});

// Methods
const useLocaleSync = async locale => {
  await i18n.setLocale(locale);
  await storage.set('locale', locale);
};

module.exports = {
  optionSchema,
  storage,
  i18n,
  useLocaleSync
};
