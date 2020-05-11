const { readFileSync } = require('fs');
const path = require('path');
const JSONC = require('jsonc');
const _ = require('lodash');
const deepdash = require('deepdash');
const dirTree = require('directory-tree');
const ora = require('ora');
const logSymbol = require('log-symbols');
const { pathOr } = require('ramda');
const {
  WebsiteSchema,
  LayoutSchema,
  FolderSchema,
  ShelfSchema,
  RedirectSchema
} = require('../schemas/index');

deepdash(_);

// Deep transformations
const deepOpts = {
  childrenPath: 'children',
  checkCircular: true,
  keepCircular: true
};

const loadDataTree = async function() {
  const parseRedirectFile = item => {
    if (item.type != 'file' && item.extension != '.jsonc') return item;

    let content = JSONC.parse(readFileSync(item.path, 'utf8'));

    let newItem = RedirectSchema.cast(content);

    return newItem;
  };

  const parseShelfFiles = item => {
    if (item.type != 'file' && item.extension != '.jsonc') return item;

    let content = JSONC.parse(readFileSync(item.path, 'utf8'));

    let newItem = ShelfSchema.cast(content);

    newItem.path = item.path;

    return newItem;
  };

  const parseSiteFiles = (item, key, parentValue, context) => {
    if (item.type != 'file' && item.extension != '.jsonc') return item;

    let content = JSONC.parse(readFileSync(item.path, 'utf8'));

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
    delete item.extension;
    return item;
  };

  const defineWebsiteUserAgentType = (item, key, parentValue, context) => {
    if (item.type != 'website') return item;
    // console.log(item);

    let primary = _.findValueDeep(
      context.obj,
      _item => _item.type === 'website' && _item.parent == undefined,
      deepOpts
    );

    if (item.id == primary.mobile) {
      item.ua = 'mobile';
    } else if (item.id == primary.tablet) {
      item.ua = 'tablet';
    } else {
      item.ua = 'desktop';
    }

    return item;
  };

  const tree = dirTree(path.resolve(global.VTEXY.dataPath), {
    extensions: /\.jsonc/
  }).children;

  let dataTree = {
    shelves: pathOr(
      tree.find(x => x.name == 'shelves' && x.type == 'directory'),
      ['children'],
      []
    ),
    sites: pathOr(
      tree.find(x => x.name == 'sites' && x.type == 'directory'),
      ['children'],
      []
    ),
    redirects: tree.find(x => x.name == 'redirects.jsonc' && x.type == 'file')
  };

  // Sites
  // 01 - Read files and cast with schemas
  dataTree.sites = _.mapValuesDeep(dataTree.sites, parseSiteFiles, deepOpts);

  // 02 - Define user agents on objects of type 'website'
  dataTree.sites = _.mapValuesDeep(
    dataTree.sites,
    defineWebsiteUserAgentType,
    deepOpts
  );

  // Shelves
  // 01 - Read file and cast with schema
  dataTree.shelves = _.mapValuesDeep(
    dataTree.shelves,
    parseShelfFiles,
    deepOpts
  );

  // Redirects
  // 01 - Read file and cast with schema
  dataTree.redirects = parseRedirectFile(dataTree.redirects);

  // Final - Clean some dirTree props
  dataTree.sites = _.mapValuesDeep(dataTree.sites, cleanDirTreeProps, deepOpts);
  dataTree.shelves = _.mapValuesDeep(
    dataTree.shelves,
    cleanDirTreeProps,
    deepOpts
  );
  dataTree.redirects = cleanDirTreeProps(dataTree.redirects);

  global.VTEXY.runtime.dataTree = dataTree;
};

const loadContentTree = async () => {
  const removeChildren = item => {
    delete item.childrens;
    return item;
  };

  const readContent = item => {
    if (item.type != 'file' && item.size == 0) return item;

    let content = readFileSync(item.path, 'utf8');
    item.content = content;
    return item;
  };

  const tree = dirTree(path.resolve(global.VTEXY.contentPath), {
    extensions: /^.*\.(?!css$|js|png|svg|jpeg|gif$).+$/
  }).children;

  const contentTree = {
    shelves: tree.find(x => x.name == 'shelves' && x.type == 'directory')
      ?.children,
    templates: tree
      .find(x => x.name == 'templates' && x.type == 'directory')
      ?.children.filter(x => x.name != 'subtemplates' && x.type != 'directory'),
    subTemplates: tree
      .find(x => x.name == 'templates' && x.type == 'directory')
      ?.children.find(x => x.name == 'subtemplates' && x.type == 'directory')
      ?.children,
    customElements: tree.find(
      x => x.name == 'custom-elements' && x.type == 'directory'
    )?.children
  };

  // Remove childrens and read content
  contentTree.templates =
    contentTree.templates.children &&
    contentTree.templates?.map(removeChildren).map(readContent);
  contentTree.subTemplates = contentTree.subTemplates
    ?.map(removeChildren)
    .map(readContent);
  contentTree.shelves = contentTree.shelves
    ?.map(removeChildren)
    .map(readContent);
  contentTree.customElements = contentTree.customElements
    ?.map(removeChildren)
    .map(readContent);

  global.VTEXY.runtime.contentTree = contentTree;
};

const loadAll = async () => {
  const spinner = ora('Loading data').start();

  await loadDataTree();

  spinner.text = 'Loading templates';

  await loadContentTree();

  spinner.text = 'Loaded with sucess';
  spinner.symbol = logSymbol.success;

  spinner.stopAndPersist();

  // console.log(global.VTEXY.runtime);
};

module.exports = {
  loadAll,
  loadContentTree,
  loadDataTree
};
