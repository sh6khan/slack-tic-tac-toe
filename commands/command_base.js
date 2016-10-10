'use strict'

/**
* CommandBase class handles reponding to commands
* coming from Slack
*/

class CommandBase {
  constructor() {
    this.defaultMessageInfo = {
      response_type: 'in_channel',
      username: 'Tiko'
    }

    this.defaultAttachmentInfo = {
      title: 'Slack Challenge',
      color: '#2FA44F',
      mrkdwn_in: ['text']
    }
  }

  /**
  * This function will send a message to the slack channel
  */
  messageChannel(message, channel_name, res) {
    let attachmentObject = this.generateAttachment(message);
    let fullResponse = this.generateResponse(attachmentObject, channel_name);

    this.sendResponse(res, fullResponse);
  }

  generateAttachment(message) {
    return Object.assign(this.defaultAttachmentInfo, message);
  }

  generateResponse(attachmentObject, channel_name) {
    let attachments = [];
    attachments.push(attachmentObject);

    const response = {
      channel: channel_name,
      attachments: attachments
    };

    return Object.assign(this.defaultMessageInfo, response);
  }

  sendResponse(res, fullResponse) {
    res.set('content-type', 'application/json');
    res.status(200).json(fullResponse);
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
    const message = {
      text: board +
            '\n\n @'+ game.currentPlayer.username + '! go get em!'
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

module.exports = CommandBase;
