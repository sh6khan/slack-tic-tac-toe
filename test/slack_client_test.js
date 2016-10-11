'use strict'

const assert = require('assert');
const nock = require('nock')
const SlackClient = require('../client/slack_client');

suite('SlackClient')

let slackClient = new SlackClient();

before('set up global users and emoji list', function(done) {
  // set up a nock for the slack client
  const nockMembers = [
    {name: "sadman", id: 1},
    {name: "obama", id: 2},
    {name: "washington", id: 3},
    {name: "thomas", id: 4},
    {name: "jefferson", id: 5},
    {name: "hamilton", id: 6},
  ]

  const nockEmoji = {
    "parrot" : "testurl",
    "fire" : "testurl",
    "100" : "testurl",
    "cry" : "testurl"
  }

  nock('https://slack.com/api')
  .post('/users.list')
  .times(2)
  .reply(200, {
    members: nockMembers
  });

  nock('https://slack.com/api')
  .post('/emoji.list')
  .reply(200, {
    emoji: nockEmoji
  });

  let slackClient = new SlackClient();
  slackClient.getAllUsers(function() {
    slackClient.getAllEmojis(done);
  });
});

test('it should be able to a user from list', function() {
  assert.equal(1, slackClient.getUserId("sadman"));
  assert.equal(2, slackClient.getUserId("obama"));
  assert.equal(3, slackClient.getUserId("washington"));
  assert.equal(undefined, slackClient.getUserId("random"));
});

test('it should be able to get a emoji from list', function() {
  assert.equal("testurl", slackClient.findEmoji("parrot"));
  assert.equal("testurl", slackClient.findEmoji("cry"));
  assert.equal("testurl", slackClient.findEmoji("fire"));
  assert.equal(undefined, slackClient.findEmoji("random"));
})
