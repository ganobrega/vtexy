const yup = require('yup');

module.exports = yup.object().shape({
  name: yup.string(),
  marketingContext: yup.string(),
  searchContext: yup.string(),
  protocol: yup.mixed().equals(['http', 'https', 'both']),
  cacheType: yup.mixed().equals(['no-cache', 'local', 'remote', 'both']),
  authenticationRequired: yup.boolean().default(true)
});
