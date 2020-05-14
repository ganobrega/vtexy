import { DirectoryTree } from 'directory-tree'
import Folder from './schemas/Folder'
import Layout from './schemas/Layout'
import Redirect from './schemas/Redirect'
import Shelf from './schemas/Shelf'
import Website from './schemas/Website'

namespace VTEXYCore {
  export interface MiddlewarePipe {
    request: object
    response?: object
    website?: Website
    layout?: Layout
    data?: string
  }

  export interface RuntimeNode {
    path: string
    children: Array<RuntimeNode>
    content?: any
  }

  export interface RuntimeDataTree {
    redirects: Array<RuntimeNode>
    sites: Array<RuntimeNode>
    shelves: Array<RuntimeNode>
  }

  export interface RuntimeContentTree {
    shelves: Array<RuntimeNode>
    templates: Array<RuntimeNode>
    subTemplates: Array<RuntimeNode>
    customElements: Array<RuntimeNode>
  }

  export class RuntimeObject {
    dataTree: RuntimeDataTree
    contentTree: RuntimeContentTree
  }

  export interface EntryArgs {
    account: string
    baseDir: string
    noSSR: boolean
  }

  export class OptionsObject {
    account: string = ''
    noSSR: boolean = false
    contentPath: string = ''
    baseDirPath: string = ''
    dataPath: string = ''
    configPath?: string = ''
  }

  export class DirTree {
    path: string = ''
    name: string = ''
    size: number = 0
    type: 'directory' | 'file' | 'layout' | 'website' = 'file'
    children?: DirectoryTree[]
    extension?: string
  }

  export declare var runtime: RuntimeObject
  export declare var options: OptionsObject
}

export = VTEXYCore
