'use strict'

const assert = require('assert');
const request = require('supertest');
const nock = require('nock');
const app = require('../app');
const GameTracker = require('../game_engine/game_tracker');
const SlackClient = require('../client/slack_client');

suite('Status Command')

let gameTracker = new GameTracker();

let baseJSON = {
  token: '123456',
  team_id: '<test_team_id>',
  team_domain: 'sadman-slack-test',
  channel_id: '222222',
  channel_name: 'general',
  user_id: 'U2LUGLNE7',
  user_name: 'sadman',
  command: '/ttc',
  text: 'challenge',
  response_url: 'https://hooks.slack.com/commands/randomfakeurl'
}

test('start server', function(done) {
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

test('POST /ttc challenge @obama :fire:, should broadcast challenge', function(done) {
  let json = baseJSON;
  json.text = "challenge @obama :parrot:";
  let expectedResponse = "@obama! you have been challenged! " +
                         "\n `/ttc accept [symbol]` to accept!`"

  request(app)
  .post('/command')
  .send(json)
  .end(function(err, resp) {
    assert.ifError(err);
    assert(resp);
    assert.equal(expectedResponse, resp.body.attachments[0].text);

    // validate game has been broadcasted
    let broadcasted = gameTracker.findBroadcastedGames(json.channel_id)
    assert.deepEqual({
      challenger: "sadman",
      challengee: "obama",
      challengerSymbol: ":parrot:"
    }, broadcasted[0]);

    done();
  });
});

test('POST /ttc accept :100:, should be able to accept challenge', function(done) {
  let json = baseJSON;
  json.text = "accept :100:";
  json.user_name = 'obama';
  let expect = 'A   |   B   |   C\n---------------------\n' +
               'D   |   E   |   F\n---------------------\n' +
               'G   |   H   |   I\n\n @sadman! go get em!';

  request(app)
  .post('/command')
  .send(json)
  .end(function(err, resp) {
    assert.equal(expect, resp.body.attachments[0].text);
    done();
  });
});

test('POST /ttc status, should print current board', function(done) {
  let json = baseJSON;
  json.text = 'status';
  json.user_name = 'thomas';
  let expect = 'A   |   B   |   C\n---------------------\n' +
               'D   |   E   |   F\n---------------------\n' +
               'G   |   H   |   I\n\n @sadman! go get em!';
  request(app)
  .post('/command')
  .send(json)
  .end(function(err, resp) {
    assert.equal(expect, resp.body.attachments[0].text);
    done();
  });
});
