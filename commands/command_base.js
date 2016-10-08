'use strict'

/**
* Abstact command interface that can be used by all
* inherited classes for message defaults
*/

class CommandBase {
  constructor() {
    this.defaultMessageInfo = {
      response_type: 'in_channel',
      username: 'Tiko'
    }

    this.defaultAttachmentInfo = {
      title: 'TicTacToe',
      color: '#2FA44F',
      mrkdwn_in: ['text']
    }
  }

  generateAttachment(message) {
    return Object.assign(this.defaultAttachmentInfo, message);
  }

  generateResponse(attachmentObject, params) {
    let attachments = [];
    attachments.push(attachmentObject);

    const response = {
      channel: params.channel_name,
      attachment: attachments
    };

    return Object.assign(this.defaultMessageInfo, response);
  }

  sendResponse(res, fullResponse) {
    res.set('content-type', 'application/json');
    res.status(200).json(fullResponse);
    console.log('done');
  }

  hanldeCommand() {
    throw new Error ('Implmentation should be in child class');
  }
}

module.exports = CommandBase;
