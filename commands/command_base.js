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

  handleCommand() {
    throw new Error ('Implmentation should be in child class');
  }
}

module.exports = CommandBase;
