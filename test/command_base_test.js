'use strict'
const assert = require('assert');
const CommandBase = require('../commands/command_base');

suite ('CommandBase');

test('it should be able to generate attachments', function() {
  let commandBase = new CommandBase();

  const message = {
    text: 'this is some help text',
  }

  const expected = {
    color: '#2FA44F',
    mrkdwn_in: ['text'],
    text: 'this is some help text',
  }

  assert.deepEqual(expected, commandBase.generateAttachment(message));
});

test('it should be able to generate full responses', function() {
  let commandBase = new CommandBase();

  const attachmentObject = {
    color: '#2FA44F',
    mrkdwn_in: ['text'],
    text: 'this is some help text',
  }

  const params = {
    channel_name: 'test_channel'
  }

  const expectedFullResponse = {
    attachments: [
      attachmentObject
    ],
    channel: 'test_channel',
    response_type: 'in_channel',
    username: 'Tiko'
  }

  assert.deepEqual(expectedFullResponse, commandBase.generateResponse([attachmentObject], params.channel_name));
});
