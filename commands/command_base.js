'use strict'

const Emoji = require('../lib/emoji');

/**
* CommandBase class handles responding to commands
* coming from Slack
*/

const defaultMessageInfo = {
  response_type: 'in_channel',
  username: 'Tiko'
}

const defaultAttachmentInfo = {
  color: '#2FA44F',
  mrkdwn_in: ['text']
}

class CommandBase {
  constructor() {}

  /**
  * This function will send a message to the slack channel
  */
  messageChannel(message, channel_name, res) {
    let attachmentObject = this.generateAttachment(message);
    let fullResponse = this.generateResponse([attachmentObject], channel_name);

    this.sendResponse(res, fullResponse);
  }

  generateAttachment(message) {
    return Object.assign(message, defaultAttachmentInfo);
  }

  generateResponse(attachments, channel_name) {
    const response = {
      channel: channel_name,
      attachments: attachments
    };

    return Object.assign(response, defaultMessageInfo);
  }

  sendResponse(res, fullResponse) {
    res.set('content-type', 'application/json');
    res.status(200).json(fullResponse);
  }

  /**
  * Validate the user passed in an emoji
  *
  * @param arg {String}
  */
  validateEmoji(arg) {
    if (arg[0] != ":") {
      return false
    }

    if (arg[arg.length - 1] != ":") {
      return false
    }

    let emoji = arg.slice(1, -1);

    if (!Emoji.get(emoji)) {
      return false
    }

    return true;
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
  * challenge accepted and print board!
  *
  * @param game {TicTacToe}
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _printBoard(game, params, res) {
    let board = game.generateBoardText();

    const moralSupport = {
      text: '@'+ game.currentPlayer.username + '! go get em!'
    }

    const boardMessage = {
      text: board
    }

    let attachments  = []
    let boardAttach = this.generateAttachment(boardMessage);
    let supportAttach = this.generateAttachment(moralSupport);

    attachments.push(boardAttach);
    attachments.push(supportAttach);

    let fullResponse = this.generateResponse(attachments, params.channel_name);

    this.sendResponse(res, fullResponse);
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
            '\n`/ttt challenge [@username] [:emoji:]` to challenge someone else'
    }

    this.messageChannel(message, params.channel_name, res);
  }

  /**
  * Invalid emoji
  *
  * @param emoji {String}
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _invalidEmoji(emoji, params, res) {
    const message = {
      text: emoji + ' is not a valid emoji :cry:'
    }

    this.messageChannel(message, params.channel_name, res);
  }
}

module.exports = CommandBase;
