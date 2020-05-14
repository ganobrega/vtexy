// High-level
import VTEXYCore = require('./types')
import { readFileSync } from 'fs'
import path from 'path'
import dirTree from 'directory-tree'
import ora from 'ora'
import * as JSONC from 'jsonc-parser'

import { schema as FolderSchema } from './schemas/Folder'
import { schema as LayoutSchema } from './schemas/Layout'
import { schema as RedirectSchema } from './schemas/Redirect'
import { schema as ShelfSchema } from './schemas/Shelf'
import { schema as WebsiteSchema } from './schemas/Website'

const mapValuesDeep = require('deepdash/getMapValuesDeep')

// Deep transformations
const deepOpts = {
  childrenPath: 'children',
  checkCircular: true,
  keepCircular: true,
}

/**
 * @description Use this function to load all files of data directory
 */
async function loadDataTree() {
  function parseRedirectFile(item: VTEXYCore.DirTree): any {
    if (item.type != 'file' && item.extension != '.jsonc') return item

    let newItem = RedirectSchema.cast(JSONC.parse(readFileSync(item.path, 'utf8')))

    return newItem
  }

  function parseShelfFiles(item: VTEXYCore.DirTree): any {
    if (item.type != 'file' && item.extension != '.jsonc') return item

    let newItem: any = ShelfSchema.cast(JSONC.parse(readFileSync(item.path, 'utf8')))

    newItem.path = item.path

    return newItem
  }

  const parseSiteFiles = (item, key, parentValue, context) => {
    if (item.type != 'file' && item.extension != '.jsonc') return item

    let content = JSONC.parse(readFileSync(item.path, 'utf8'))

    let newItem: any, type: any

    if (/\/_\/(.*)_\.jsonc/.test(item.path)) {
      // Identify if file is FolderSchema
      newItem = FolderSchema.cast(content)
      type = 'folder'
    } else if (/_\.jsonc/.test(item.path) && item.path.indexOf('/_/') < 0) {
      // Identify if file is WebsiteSchema
      newItem = WebsiteSchema.cast(content)
      type = 'website'
    } else {
      // Else, the file is generally LayoutSchema
      newItem = LayoutSchema.cast(content)
      type = 'layout'
    }

    newItem.path = item.path
    newItem.children = item.children
    newItem.type = type

    return newItem
  }

  function cleanDirTreeProps(item: VTEXYCore.DirTree) {
    delete item.size
    delete item.extension
    return item
  }

  function defineWebsiteUserAgentType(item: VTEXYCore.DirTree, key: any, parentValue: any, context: any) {
    if (item.type != 'website') return item
    // console.log(item);

    let primary = mapValuesDeep(context.obj, (x: any) => x.type === 'website' && x.parent == undefined, deepOpts)

    if (item.id == primary.mobile) {
      item.ua = 'mobile'
    } else if (item.id == primary.tablet) {
      item.ua = 'tablet'
    } else {
      item.ua = 'desktop'
    }

    return item
  }

  const tree: any = dirTree(path.resolve(VTEXYCore.options.dataPath), {
    extensions: /\.jsonc/,
  }).children

  let dataTree = {
    shelves: tree.find((x: VTEXYCore.DirTree) => x.name == 'shelves' && x.type == 'directory')?.children,
    sites: tree.find((x: VTEXYCore.DirTree) => x.name == 'sites' && x.type == 'directory')?.children,
    redirects: tree.find((x) => x.name == 'redirects.jsonc' && x.type == 'file'),
  }

  // Sites
  // 01 - Read files and cast with schemas
  dataTree.sites = mapValuesDeep(dataTree.sites, parseSiteFiles, deepOpts)

  // 02 - Define user agents on objects of type 'website'
  dataTree.sites = mapValuesDeep(dataTree.sites, defineWebsiteUserAgentType, deepOpts)

  // Shelves
  // 01 - Read file and cast with schema
  dataTree.shelves = mapValuesDeep(dataTree.shelves, parseShelfFiles, deepOpts)

  // Redirects
  // 01 - Read file and cast with schema
  dataTree.redirects = parseRedirectFile(dataTree.redirects)

  // Final - Clean some dirTree props
  dataTree.sites = mapValuesDeep(dataTree.sites, cleanDirTreeProps, deepOpts)
  dataTree.shelves = mapValuesDeep(dataTree.shelves, cleanDirTreeProps, deepOpts)
  dataTree.redirects = cleanDirTreeProps(dataTree.redirects)

  VTEXYCore.runtime.dataTree = dataTree
}

/**
 * @description Load all files of data contente directory
 */
async function loadContentTree() {
  const removeChildren = (item) => {
    delete item.childrens
    return item
  }

  const readContent = (item) => {
    if (item.type != 'file' && item.size == 0) return item

    let content = readFileSync(item.path, 'utf8')
    item.content = content
    return item
  }

  const tree: any = dirTree(path.resolve(VTEXYCore.options.contentPath), {
    extensions: /^.*\.(?!css$|js|png|svg|jpeg|gif$).+$/,
  }).children

  const contentTree = {
    shelves: tree.find((x) => x.name == 'shelves' && x.type == 'directory')?.children,
    templates: tree
      .find((x) => x.name == 'templates' && x.type == 'directory')
      ?.children.filter((x) => x.name != 'subtemplates' && x.type != 'directory'),
    subTemplates: tree
      .find((x) => x.name == 'templates' && x.type == 'directory')
      ?.children.find((x) => x.name == 'subtemplates' && x.type == 'directory')?.children,
    customElements: tree.find((x) => x.name == 'custom-elements' && x.type == 'directory')?.children,
  }

  // Remove childrens and read content
  contentTree.templates = contentTree.templates.children && contentTree.templates?.map(removeChildren).map(readContent)
  contentTree.subTemplates = contentTree.subTemplates?.map(removeChildren).map(readContent)
  contentTree.shelves = contentTree.shelves?.map(removeChildren).map(readContent)
  contentTree.customElements = contentTree.customElements?.map(removeChildren).map(readContent)

  VTEXYCore.runtime.contentTree = contentTree
}

/**
 * @description Load the content and data directories
 */
async function loadAll() {
  initNamespace()

  const spinner = ora('Loading data').start()

  await loadDataTree()

  spinner.text = 'Loading templates'

  await loadContentTree()

  spinner.stop()

  // consola.success(`Ready to start!`);

  // console.log(VTEXYCore.runtime);
}

async function initNamespace() {
  VTEXYCore.runtime = new VTEXYCore.RuntimeObject()
}

export default function () {
  initNamespace()

  return {
    loadAll,
    loadContentTree,
    loadDataTree,
  }
}
