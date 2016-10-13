'use strict'

const CommandBase = require('./command_base');

class HelpCommand extends CommandBase {
  constructor() {
    super();
  }

  handleCommand(gameTracker, params, res) {
    let game = gameTracker.find_game(params.channel_id);
    let moves = game != null ? game.remainingMoves() : ["A", "B", "C", "D", "E", "F", "G", "H", "I"]

    const helpMessage = {
      text: '`/ttt challenge [@username] [:emoji:]` play tictactoe !' +
		        '\n`/ttt place [cell name]` place move on empty space ' + moves + ' of the board' +
            '\n`/ttt quit` quits the current game in the channel' +
            '\n`/ttt help`'
    }

    this.messageChannel(helpMessage, params.channel_name, res);
    return
  }
}

module.exports = HelpCommand;
