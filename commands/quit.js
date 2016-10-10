'use strict'

const CommandBase = require('./command_base');
const SlackClient = require('../client/slack_client');

class QuitCommand extends CommandBase {
  constructor() {
    super();
  }

  handleCommand(gameTracker, params, res) {
    let game = gameTracker.find_game(params.channel_id);

    if (!game) {
      this._gameNotFound(params, res);
      return;
    }

    let username = params.user_name;

    if (username != game.playerOne.username &&
        username != game.playerTwo.username) {

        this._invalidQuit(username, params, res);
        return;
    }

    gameTracker.removeGame(params.channel_id, game);

    this._gameQuit(username, params, res);
    return;
  }

  /**
  * The wrong user tried to quit the game
  *
  * @param username {String}
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _invalidQuit(username, params, res) {
    const message = {
      text: '@' + username + ' you can\'t quit the current game, your not playing.'
    }

    this.messageChannel(message, params.channel_name, res);
  }

  /**
  * Game is finished
  *
  * @param username {String}
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _gameQuit(username, params, res) {
    const message = {
      text: '@' + username + ' quit the game :cry:'
    }

    this.messageChannel(message, params.channel_name, res);
  }
}

module.exports = QuitCommand
