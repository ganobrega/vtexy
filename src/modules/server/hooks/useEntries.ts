import VTEXYCore = require('../types')
import {join} from 'path'

export default async function(entries: VTEXYCore.EntryArgs) {

    // console.log(entries);

    const options : VTEXYCore.OptionsObject = {
        account: entries.account,
        noSSR: entries.noSSR,
        baseDirPath: entries.baseDir,
        contentPath: join(entries.baseDir, 'dist'),
        dataPath: join(entries.baseDir, 'data')
    }

    VTEXYCore.options = options
}