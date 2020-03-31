const folderSchema = require('../models/Folder');

const layout = {
  name: '',
  marketingContext: '',
  searchContext: '',
  protocol: 'https',
  cacheType: 'no-cache',
  authenticationRequired: false
};

(async () => {
  let result = await folderSchema.validate(layout);
  console.log(result);
})();
