'use strict'

const CommandBase = require('./command_base');

class UnkownCommand extends CommandBase {
  constructor() {
    super();
  }

  handleCommand(cmd, params, res) {
    const unkownCommandMessage = {
      text: 'Hmm I have no idea what ' + cmd + ' is. type `/ttt help` to see all the things I can do`' +
            '\n In the mean time, here are some other things I dont know how to do' +
            '\n I cant play music' +
		        '\n I can chill but I can\'t netflix :sadpanda:' +
            '\n I can\'t eat cake'
    }

    this.messageChannel(unkownCommandMessage, params.channel_name, res);
    return
  }
}

module.exports = UnkownCommand
