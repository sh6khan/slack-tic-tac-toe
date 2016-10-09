'use strict'

const CommandBase = require('./command_base');

class HelpCommand extends CommandBase {
  constructor() {
    super();
  }

  /**
  *  return  a json response to slack to be rendered in the channel
  */
  hanldeCommand(gameTracker, params, res) {
    let game = gameTracker.find_game(params.channel_id);
    let moves = game != null ? game.remainingMoves() : ["A", "B", "C", "D", "E", "F", "G", "H", "I"]

    const helpMessage = {
      text: '`/ttc challenge [@username] [symbol]` play tictactoe with <username> using the <sybmol>' +
		        '\n`/ttc place [cell name]` place move on empty space ' + moves + ' of the board' +
            '\n`/ttc quit` quits the current game in the channel' +
            '\n`/ttc help`',
    }

    this.messageChannel(helpMessage, params.channel_name, res);
    return
  }
}

module.exports = HelpCommand;
