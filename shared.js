const fs = require('fs'),
  path = require('path'),
  Conf = require('conf'),
  i18n = require('i18n');

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

const defaultConfigsSchema = ['account', 'serveDir', 'path'];

// Methods
const useLocaleSync = async locale => {
  await i18n.setLocale(locale);
  await storage.set('locale', locale);
};

module.exports = {
  defaultConfigsSchema,
  storage,
  i18n,
  useLocaleSync
};
