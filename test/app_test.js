'use strict'

const assert = require('assert');
const request = require('supertest');
const nock = require('nock');
const app = require('../app');


suite('app')

let server;

let baseJSON = {
  token: '123456',
  team_id: 'T2M0FDQUU',
  team_domain: 'sadman-slack-test',
  channel_id: 'C2M333AUA',
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

  server = app.listen(function() {
    done();
  });
});

test('GET /', function(done) {
  request(app)
  .get('/')
  .expect(200, done)
});

test('POST /command help', function(done) {
  let json = baseJSON;
  json.text = "help"

  request(app)
  .post('/command')
  .send(json)
  .end(function(err, resp) {
    assert.ifError(err);
    assert(resp);
    let body = resp.body;
    assert.equal("in_channel", body.response_type);

    done();
  });
});

test('POST /command nothing, should trigger the unkown command', function(done) {
  let json = baseJSON;
  json.text = "nothing"
  let expect = 'Hmm I have no idea what nothing is. type `/ttt help` to see all the things I can do`' +
              '\n In the mean time, here are some other things I dont know how to do' +
              '\n I cant play music' +
              '\n I can chill but I can\'t netflix :sadpanda:' +
              '\n I can\'t eat cake'

  request(app)
  .post('/command')
  .send(json)
  .end(function(err, resp) {
    let body = resp.body;
    assert.equal(expect, body.attachments[0].text);
    done();
  });
})
