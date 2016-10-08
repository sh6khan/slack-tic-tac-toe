'use strict'

const CommandBase = require('./command_base');

class HelpCommand extends CommandBase {
  constructor() {
    super();
  }

  /**
  *  return  a json response to slack to be rendered in the channel
  */
  hanldeCommand(game, params, res) {

    let moves = game != null ? game.remainingMoves() : ["A", "B", "C", "D", "E", "F", "G", "H", "I"]

    const helpMessage = {
      text: '`/ttc start [username]` play tictactoe with username' +
		        '\n`/ttc place [cell name]` place move on empty space ' + moves + ' of the board' +
            '\n`/tictactoe quit` quits the current game in the channel' +
            '\n`/tictactoe help`',
    }

    const attachment = this.generateAttachment(helpMessage)
    const fullResponse = this.generateResponse(attachment, params);

    this.sendResponse(res, fullResponse);
    return
  }
}

module.exports = HelpCommand;
