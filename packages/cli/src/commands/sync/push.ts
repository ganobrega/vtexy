import {Command, flags} from '@oclif/command'

export default class SyncPushCommand extends Command {
  static description = 'push data to VTEX'

  static examples = ['$ vtexy sync:push']

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {args, flags} = this.parse(SyncPushCommand)
  }
}
