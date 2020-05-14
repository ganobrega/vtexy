import {Command, flags} from '@oclif/command'

export default class SyncPullCommand extends Command {
  static description = 'pull data from VTEX'

  static examples = ['$ vtexy sync:pull']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {args, flags} = this.parse(SyncPullCommand)
  }
}
