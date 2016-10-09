'use strict'

const CommandBase = require('./command_base');
const SlackClient = require('../client/slack_client');
const Player = require('../lib/player');
const TicTacToe = require('../game_engine/tic_tac_toe');

class AcceptCommand extends CommandBase {
  constructor() {
    super();
  }

  hanldeCommand(gameTracker, params, res) {
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

    let acceptedChallenge = gameTracker.acceptChallenge(params.channel_id, params.user_name);
    if (!acceptedChallenge) {
      this._gameNotFound(params, res);
      return;
    }

    let symbol = args[1];
    let challenger = acceptedChallenge.challenger;
    let challengerSymbol = acceptedChallenge.challengerSymbol;

    // game found, which means we can start!
    // challenger goes first
    let playerOne = new Player(challengerSymbol, challenger);
    let playerTwo = new Player(symbol, params.user_name);

    game = new TicTacToe(playerOne, playerTwo);

    gameTracker.gameStarted(params.channel_id, game);

    this._printBoard(game, params, res);
    return;
  }

  /**
  * message the channel when there is already an active game
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _gameAlreadyInChannel(params, res) {
    const message = {
      text: 'This channel already has a game running'
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
      text: '`/ttc accept [symbol]` to accept a challenge' +
            '\n `/ttc accept :fire:` (example)'
    }

    this.messageChannel(message, params.channel_name, res);
  }

  /**
  * No broadcaseted game found for this user
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _gameNotFound(params, res) {
    const message = {
      text: 'couldn\'t find game where you were challenged' +
            '\n`/ttc challenge [@username] [symbol]` to challenge someone else'
    }

    this.messageChannel(message, params.channel_name, res);
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

module.exports = AcceptCommand;
