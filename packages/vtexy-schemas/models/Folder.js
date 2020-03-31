const { mixed, string, object, boolean } = require('yup');

module.exports = object().shape({
  name: string().defined(),
  marketingContext: string().defined(),
  searchContext: string().defined(),
  protocol: mixed()
    .defined()
    .equals(['http', 'https', 'both']),
  cacheType: mixed()
    .defined()
    .equals(['no-cache', 'local', 'remote', 'both']),
  authenticationRequired: boolean()
    .defined()
    .default(true)
});
