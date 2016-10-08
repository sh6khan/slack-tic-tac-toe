'use strict'
const assert = require('assert');
const CommandBase = require('../commands/command_base');

suite ('CommandBase');

test('it should be able to generate attachments', function(done) {
  let commandBase = new CommandBase();

  const message = {
    text: 'this is some help text',
  }

  const expected = {
    title: 'Slack Challenge',
    color: '#2FA44F',
    mrkdwn_in: ['text'],
    text: 'this is some help text',
  }

  assert.deepEqual(expected, commandBase.generateAttachment(message));
  done();
});

test('it should be able to generate full responses', function(done) {
  let commandBase = new CommandBase();

  const attachmentObject = {
    title: 'Slack Challenge',
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

  assert.deepEqual(expectedFullResponse, commandBase.generateResponse(attachmentObject, params));
  done();
});
