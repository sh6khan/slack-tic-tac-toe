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
      this._missingArgs(params, res);
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
      gameTracker.removeGame(params.channel_id, game);
      return;
    }

    if (results.tied) {
      this._tied(game, params, res);
      gameTracker.removeGame(params.channel_id, game);
      return;
    }

    this._printBoard(game, params, res);
    return;
  }

  /**
  * The game is tied
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _tied(game, params, res) {
    let board = game.generateBoardText();

    const boardMessage = {
      text: board
    }

    const tiedMessage = {
      text: 'The game is tied :cry:'
    }

    let attachments  = []
    attachments.push(this.generateAttachment(boardMessage));
    attachments.push(this.generateAttachment(tiedMessage));

    let fullResponse = this.generateResponse(attachments, params.channel_name);

    this.sendResponse(res, fullResponse);
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

    const boardMessage = {
      text: board
    }

    const winnerMessage = {
      text: '@'+ username + '! is the winner :smile:'
    }

    let attachments  = []
    attachments.push(this.generateAttachment(boardMessage));
    attachments.push(this.generateAttachment(winnerMessage));

    let fullResponse = this.generateResponse(attachments, params.channel_name);

    this.sendResponse(res, fullResponse);
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
  * Wrong player
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
  _missingArgs(params, res) {
    const message = {
      text: 'wrong number of args' +
            '\n`/ttt move [cell] to make a move'
    }

    this.messageChannel(message, params.channel_name, res);
  }
}

module.exports = MoveCommand;
