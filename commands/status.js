'use strict'

const CommandBase = require('./command_base');
const SlackClient = require('../client/slack_client');

class StatusCommand extends CommandBase {
  constructor() {
    super();
  }

  handleCommand(gameTracker, params, res) {
    let game = gameTracker.find_game(params.channel_id);

    if (!game) {
      this._gameNotFound(params, res);
      return;
    }

    this._printBoard(game, params, res);
    return;
  }

  _gameNotFound(params, res) {
    const message = {
      text: "There is no game currently on this channel"
    }

    this.messageChannel(message, params, res);
  }

  /**
  * No broadcaseted game found for this user
  *
  * @param game {TicTacToe}
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _printBoard(game, params, res) {
    let board = game.generateBoardText();
    const message = {
      text: board +
            '\n\n @'+ game.currentPlayer.username + '! go get em!'
    }

    this.messageChannel(message, params.channel_name, res);
  }
}

module.exports = StatusCommand;
