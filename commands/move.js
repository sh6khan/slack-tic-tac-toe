'use strict'

const CommandBase = require('./command_base');
const SlackClient = require('../client/slack_client');

class MoveCommand extends CommandBase {
  constructor() {
    super();
  }

  handleCommand(gameTracker, params, res) {
    let game = gameTracker.find_game(params.channel_id);

    if (!game) {
      this._gameNotFound(params, res);
      return;
    }

    let args = params.text.split(' ');

    if (args.length < 2) {
      this._wrongNumberArg(params, res);
      return;
    }

    let player = game.currentPlayer
    let move = args[1];

    if (player.username != params.user_name) {
      this._wrongPlayer(params, res);
      return;
    }

    let results = game.placeMove(move, player)

    if (results.err == "Invalid move") {
      this._invalidMove(params, res);
      return;
    }

    if (results.err == "Cell full") {
      this._cellFull(params, res);
      return;
    }

    if (results.winner) {
      this._winner(game, params, res);
      game.removeGame(params.channel_id, game);
      return;
    }

    if (results.tied) {
      this._tied(params, res);
      game.removeGame(params.channel_id, game);
      return;
    }

    this._printBoard(game, params, res);
    return;
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

  /**
  * we have a winner !!
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _tied(params, res) {
    let username = player.username

    const message = {
      text: 'the game is tied :cry:'
    }

    this.messageChannel(message, params.channel_name, res);
  }

  /**
  * we have a winner !!
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _winner(game, params, res) {
    let username = game.currentPlayer.username;
    let board = game.generateBoardText();

    const message = {
      text: board +
            '\n@' + username + ' IS THE WINNER'
    }

    this.messageChannel(message, params.channel_name, res);
  }

  /**
  * Cell is full
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _cellFull(params, res) {
    const message = {
      text: 'That cell is full'
    }

    this.messageChannel(message, params.channel_name, res);
  }

  /**
  * Invalid move
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _wrongPlayer(params, res) {
    const message = {
      text: 'Its not your turn!'
    }

    this.messageChannel(message, params.channel_name, res);
  }

  /**
  * Invalid move
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _invalidMove(params, res) {
    const message = {
      text: 'Invalid move'
    }

    this.messageChannel(message, params.channel_name, res);
  }

  /**
  * Wrong number of args
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _wrongNumberArg(params, res) {
    const message = {
      text: 'wrong number of args' +
            '\n`/ttc move [cell] to make a move'
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
}

module.exports = MoveCommand;
