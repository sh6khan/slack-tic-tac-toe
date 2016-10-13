'use strict'

const assert = require('assert');
const request = require('supertest');
const nock = require('nock');
const app = require('../app');
const GameTracker = require('../game_engine/game_tracker');
const SlackClient = require('../client/slack_client');

suite('Quit Command')

let server;
let gameTracker = new GameTracker();

let baseJSON = {
  token: '123456',
  team_id: '<test_team_id>',
  team_domain: 'sadman-slack-test',
  channel_id: '222222',
  channel_name: 'general',
  user_id: 'U2LUGLNE7',
  user_name: 'sadman',
  command: '/ttt',
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

  nock('https://slack.com/api')
  .post('/users.list')
  .times(2)
  .reply(200, {
    members: nockMembers
  });

  let slackClient = new SlackClient();
  slackClient.getAllUsers(done);
});


test('POST /ttt challenge @obama :fire:, should broadcast challenge', function(done) {
  let json = baseJSON;
  json.text = "challenge @obama :cry:";
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
      challengerSymbol: ":cry:"
    }, broadcasted[0]);

    done();
  });
});

test('POST /ttt accept :100:, should be able to accept challenge', function(done) {
  let json = baseJSON;
  json.text = "accept :100:";
  json.user_name = 'obama';

  request(app)
  .post('/command')
  .send(json)
  .end(function(err, resp) {
    let game = gameTracker.find_game(json.channel_id);
    let expect = game.generateBoardText();


    assert.equal(expect, resp.body.attachments[0].text);
    done();
  });
});

test('POST /ttt quit, should not quit from wrong user', function(done) {
  let json = baseJSON;
  json.text = "quit";
  json.user_name = 'thomas';
  let expect = '@thomas you can\'t quit the current game, your not playing.'

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


test('POST /ttt quit, should quit the game', function(done) {
  let json = baseJSON;
  json.text = "quit";
  json.user_name = 'obama';
  let expect = '@obama quit the game :cry:';

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
