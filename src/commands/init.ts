import {Command, flags} from '@oclif/command'

export default class InitCommand extends Command {
  static description = 'init a vtexy project'

  static examples = ['$ vtexy init -a storetheme']

  static flags = {
    account: flags.string({char: 'a', description: 'store account name'}),
    // 'base-dir': flags.string({char: 'd', description: 'directory of the content'}),
    'no-ssr': flags.boolean({description: 'disable local ssr, only proxy static files'}),
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {args, flags} = this.parse(InitCommand)

    // Enquirer
  }
}
