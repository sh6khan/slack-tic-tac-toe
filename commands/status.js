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
}

module.exports = StatusCommand;
