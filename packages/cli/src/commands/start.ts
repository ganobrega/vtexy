import {Command, flags} from '@oclif/command'
import {cosmiconfigSync} from 'cosmiconfig'
import {start} from '@vtexy/core'

export default class StartCommand extends Command {
  static description = 'serve local development'

  static examples = ['$ vtexy start -a storetheme']

  static flags = {
    account: flags.string({char: 'a', description: 'store account name'}),
    baseDir: flags.string({char: 'd', description: 'directory of the content', default: process.cwd()}),
    noSSR: flags.boolean({description: 'disable local ssr, only proxy static files'}),
    help: flags.help({char: 'h'}),
  }

  async run() {
    try {
      const explorer = await cosmiconfigSync('vtexy')
      const options = await explorer.search()

      const {args, flags} = this.parse(StartCommand)

      if (options?.filepath) {
        start({...options?.config, ...flags})
      } else {
        start({...args, ...flags})
      }
    } catch (error) {
      this.error(error)
      this.exit(0)
    }
  }
}
