'use strict'

const CommandBase = require('./command_base');
const SlackClient = require('../client/slack_client');
const Player = require('../lib/player');
const TicTacToe = require('../game_engine/tic_tac_toe');

class AcceptCommand extends CommandBase {
  constructor() {
    super();
  }

  handleCommand(gameTracker, params, res) {
    let game = gameTracker.find_game(params.channel_id);

    if (game) {
      this._gameAlreadyInChannel(params, res);
      return;
    }

    let args = params.text.split(' ');
    let user = params.username;

    // the challenger did not add a challengee
    if (args.length < 2) {
      this._missingArgs(params, res);
      return;
    }

    if (!this.validateEmoji(args[1])) {
      this._invalidEmoji(args[1], params, res);
      return;
    }

    let challenge = gameTracker.findChallenge(params.channel_id, params.user_name);
    if (!challenge) {
      this._gameNotFound(params, res);
      return;
    }

    let symbol = args[1];
    let challenger = challenge.challenger;
    let challengerSymbol = challenge.challengerSymbol;

    if (challengerSymbol == symbol) {
      this._sameSymbol(params, res);
      return;
    }

    // game found, which means we can start!
    // challenger goes first
    let playerOne = new Player(challengerSymbol, challenger);
    let playerTwo = new Player(symbol, params.user_name);

    game = new TicTacToe(playerOne, playerTwo);

    gameTracker.acceptChallenge(params.channel_id);
    gameTracker.gameStarted(params.channel_id, game);


    this._printBoard(game, params, res);
    return;
  }

  /**
  * Both players cannot use the same emoji
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _sameSymbol(params, res) {
    const message = {
      text: 'Unfortunetly you cannot both use the same emoji :cry:'
    }

    this.messageChannel(message, params.channel_name, res);
  }

  /**
  * message the channel when challenger is missing args
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _missingArgs(params, res) {
    const message = {
      text: '`/ttt accept [:emoji:]` to accept a challenge' +
            '\n `/ttt accept :fire:` (example)'
    }

    this.messageChannel(message, params.channel_name, res);
  }
}

module.exports = AcceptCommand;
