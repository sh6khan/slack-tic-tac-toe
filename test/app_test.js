'use strict'

const assert = require('assert');
const request = require('supertest');
const app = require('../app');


suite('app')

let server;

test('start server', function(done) {
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
  .send({
    channel_id: "111",
    text: "help"
  })
  .end(function(err, resp) {
    assert.ifError(err);
    assert(resp);

    let body = resp.body;
    assert.equal('Tiko', body.username);

    done();
  });
});