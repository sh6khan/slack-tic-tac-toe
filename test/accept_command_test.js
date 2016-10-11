'use strict'

const assert = require('assert');
const request = require('supertest');
const nock = require('nock');
const app = require('../app');
const GameTracker = require('../game_engine/game_tracker');
const SlackClient = require('../client/slack_client');


suite('Accept Command')

let server;
let gameTracker = new GameTracker();

let baseJSON = {
  token: '123456',
  team_id: '<test_team_id>',
  team_domain: 'sadman-slack-test',
  channel_id: 'C2M127AUA',
  channel_name: 'general',
  user_id: 'U2LUGLNE7',
  user_name: 'sadman',
  command: '/ttt',
  text: 'challenge',
  response_url: 'https://hooks.slack.com/commands/T2M0FDQUU/89117310900/5fl3AwUEb4IpFoENvCewYUT9'
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

test('POST /ttt challenge @obama :fire:, should broadcast challenge', function(done) {
  let json = baseJSON;
  json.text = "challenge @obama :parrot:";
  let expectedResponse = "@obama! you have been challenged! " +
                         "\n `/ttt accept [:emoji:]` to accept!`"

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

test('POST /ttt accept :ranomd:, invalid emoji', function(done) {
  let json = baseJSON;
  json.text = "accept :ranomd:";
  json.user_name = 'obama';
  let expect = ':ranomd: is not a valid emoji :cry:'

  request(app)
  .post('/command')
  .send(json)
  .end(function(err, resp) {
    assert.ifError(err);
    assert(resp);
    console.log(resp.body);
    assert.equal(expect, resp.body.attachments[0].text);
    done();
  });
});


test('POST /ttt accept :100:, should be able to accept challenge', function(done) {
  let json = baseJSON;
  json.text = "accept :100:";
  json.user_name = 'obama';
  let expect = 'A     |   B   |   C\n---------------------\n' +
               'D     |   E   |   F\n---------------------\n' +
               'G     |   H   |   I\n\n @sadman! go get em!';

  request(app)
  .post('/command')
  .send(json)
  .end(function(err, resp) {
    assert.ifError(err);
    assert(resp);
    console.log(resp.body)
    assert.equal(expect, resp.body.attachments[0].text);
    done();
  });
});

test('POST /ttt accept :100: if game already in channel', function(done) {
  let json = baseJSON;
  json.text = "accept :100:";
  let expect = 'This channel already has a game running';

  request(app)
   .post('/command')
   .send(json)
   .end(function(err, resp) {
     assert.ifError(err);
     assert(resp);
     assert.equal(expect, resp.body.attachments[0].text);
     done();
   });
});

test('POST /ttt accept :100: if never challenged', function(done) {
  let json = baseJSON;
  json.text = "accept :100:";
  json.channel_id = "1111";
  let expect = 'couldn\'t find game where you were challenged' +
             '\n`/ttt challenge [@username] [:emoji:]` to challenge someone else';

  request(app)
   .post('/command')
   .send(json)
   .end(function(err, resp) {
     assert.ifError(err);
     assert(resp);
     assert.equal(expect, resp.body.attachments[0].text);
     done();
   });
});
