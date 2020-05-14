import VTEXYCore = require('./types');
import consola from 'consola';
import chalk from 'chalk';

// ESModules
import path from 'path';
import terminalLink from 'terminal-link';
import browserSync from 'browser-sync';

import preload from './preload';
import useEntries from './hooks/useEntries';

import VTEXYServerMiddleware from './middleware';

export default async function(entries: VTEXYCore.EntryArgs) {
    await useEntries(entries);

    const { loadAll, loadContentTree, loadDataTree } = preload();

    await loadAll();

    var bs = browserSync.create();

    bs.watch(path.join(VTEXYCore.options.dataPath, '**/*')).on('change', () =>
        (async () => {
        await loadDataTree();
        })()
    );

    bs.watch(path.join(VTEXYCore.options.contentPath, '**/*')).on('change', () =>
        (async () => {
        await loadContentTree();
        })()
    );

    bs.emitter.on('init', bsInstance => {
        Array.from(bsInstance.options.get('urls')).map((item: any) => {
        let link = terminalLink(item[1], item[1], { fallback: () => item[1] });
        let name = item[0];
        // let nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);

        // consola.info(`${nameCapitalized} ${chalk.underline(link)}`);
            if(name == 'external'){
                consola.log(`Serving VTEXY at ${chalk.bold.cyanBright(link)}`)
            }
        });

        if (!VTEXYCore.options.noSSR) {
            bsInstance.addMiddleware('*', VTEXYServerMiddleware);
        }

        // consola.info(
        // `Local Server Side Rendering is ${
        //     VTEXYCore.options.noSSR
        //     ? chalk.red('disabled')
        //     : chalk.green('enabled')
        // }`
        // );
    });

    bs.init({
        // Enabled
        watch: true,
        https: true,
        online: true,

        // Disabled
        open: false,
        ui: false,
        minify: false,
        logFileChanges: false,
        notify: false,
        reloadOnRestart: false,

        // Configurations
        logLevel: 'silent',
        logPrefix: 'VTEXY',
        host: `${VTEXYCore.options.account}.vtexlocal.com.br`,
        proxy: `https://${VTEXYCore.options.account}.vtexcommercestable.com.br`,
        files: [
        path.resolve(VTEXYCore.options.contentPath, 'dist/arquivos/**/*'),
        path.resolve(VTEXYCore.options.contentPath, 'dist/files/**/*')
        ],

        middleware: [],

        serveStatic: [
        {
            route: '/arquivos',
            dir: path.resolve(VTEXYCore.options.contentPath, 'arquivos')
        },
        {
            route: '/files',
            dir: path.resolve(VTEXYCore.options.contentPath, 'files')
        }
        ],

        snippetOptions: {
        rule: {
            match: /(<\/body>|<\/pre>)/i,
            fn: function(snippet, match) {
            return snippet + match;
            }
        }
        }
    });

}