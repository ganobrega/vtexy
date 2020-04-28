const fs = require('fs');
const path = require('path');
const JSONC = require('jsonc');
const _ = require('lodash');
const { WebsiteSchema, LayoutSchema, FolderSchema } = require('../vtexy-schemas');
const dirTree = require('directory-tree');

require('deepdash')(_);

module.exports = async function() {
  const parseFiles = item => {
    if (item.type != 'file') return item;

    let content = JSONC.parse(fs.readFileSync(item.path, 'utf8'));

    let newItem, type;

    if (/\/_\/(.*)_\.jsonc/.test(item.path)) {
      // Identify if file is FolderSchema
      newItem = FolderSchema.cast(content);
      type = 'folder';
    } else if (/_\.jsonc/.test(item.path) && item.path.indexOf('/_/') < 0) {
      // Identify if file is WebsiteSchema
      newItem = WebsiteSchema.cast(content);
      type = 'website';
    } else {
      // Else, the file is generally LayoutSchema
      newItem = LayoutSchema.cast(content);
      type = 'layout';
    }

    newItem.path = item.path;
    newItem.children = item.children;
    newItem.type = type;

    return newItem;
  };

  const cleanDirTreeProps = item => {
    delete item.size;
    return item;
  };

  const defineWebsiteUserAgentType = (item, key, parentValue, context) => {
    if (item.type != 'website') return item;

    let primary = _.findValueDeep(context.obj, _item => _item.type != 'website' && _item.parent == undefined, {
      childrenPath: 'children',
      checkCircular: true,
      keepCircular: true
    });

    if (item.id == primary.mobile) {
      item.ua = 'mobile';
    } else if (item.id == primary.tablet) {
      item.ua = 'tablet';
    } else {
      item.ua = 'desktop';
    }

    return item;
  };

  const tree = dirTree(path.resolve(process.env.VTEXY_DATA, 'sites'), { extensions: /\.jsonc/ });

  // Deep transformations
  let deepOpts = {
    childrenPath: 'children',
    checkCircular: true,
    keepCircular: true
  };

  // Read files and cast them by schemas
  let data = _.mapValuesDeep(tree, parseFiles, deepOpts);

  // Clean some dirTree props
  data = _.mapValuesDeep(data, cleanDirTreeProps, deepOpts);

  // Define user agents on objects of type 'website'
  data = _.mapValuesDeep(data, defineWebsiteUserAgentType, deepOpts);

  global.vtexyDataTree = data;
};
