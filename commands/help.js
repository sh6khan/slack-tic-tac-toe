'use strict'

const CommandBase = require('./command_base');

class HelpCommand extends CommandBase {
  constructor() {
    super();
  }

  /**
  *  return  a json response to slack to be rendered in the channel
  */

  handleCommand(game, params, res) {

    const remainingMoves = game.remainingMoves();

    const helpMessage = {
      text: '`/ttc start [username]` play tictactoe with username' +
		        '\n`/ttc place [cell name]` place move on empty space ' + remainingMoves + ' of the board' +
            '\n`/tictactoe quit` quits the current game in the channel' +
            '\n`/tictactoe help`',
    }

    const attachment = this.generateAttachment(helpMessage)
    const fullResponse = this.generateResponse(attachment, params);

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
  }
}

module.exports = HelpCommand;
