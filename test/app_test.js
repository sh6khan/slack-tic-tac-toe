'use strict'

const assert = require('assert');
const request = require('supertest');
const nock = require('nock');
const app = require('../app');


suite('app')

let server;

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
  request(app)
  .post('/command')
  .send(
    { token: 'RNyL8BMCMIaDNgPpZ1AqXVbC',
      team_id: 'T2M0FDQUU',
      team_domain: 'sadman-slack-test',
      channel_id: 'C2M127AUA',
      channel_name: 'general',
      user_id: 'U2LUGLNE7',
      user_name: 'sadman',
      command: '/ttc',
      text: 'help',
      response_url: 'https://hooks.slack.com/commands/T2M0FDQUU/89117310900/5fl3AwUEb4IpFoENvCewYUT9' }
  )
  .end(function(err, resp) {
    assert.ifError(err);
    assert(resp);

    let body = resp.body;
    assert.equal("in_channel", body.response_type);

    done();
  });
});
