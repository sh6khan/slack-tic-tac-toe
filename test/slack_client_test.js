'use strict'

const assert = require('assert');
const nock = require('nock')
const SlackClient = require('../client/slack_client');

suite('SlackClient')

let slackClient = new SlackClient();

before('set up global users list', function(done) {
  // set up a nock for the slack client
  const nockMembers = [
    {username: "sadman", id: 1},
    {username: "obama", id: 2},
    {username: "washington", id: 3},
    {username: "thomas", id: 4},
    {username: "jefferson", id: 5},
    {username: "hamilton", id: 6},
  ]

  nock('https://slack.com/api')
  .post('/users.list')
  .reply(200, {
    members: nockMembers
  });

  slackClient.getAllUsers(done);
});

test('it should be able to create a user list', function() {
  assert.equal(1, slackClient.getUserId("sadman"));
  assert.equal(2, slackClient.getUserId("obama"));
  assert.equal(3, slackClient.getUserId("washington"));
  assert.equal(undefined, slackClient.getUserId("random"));
});
