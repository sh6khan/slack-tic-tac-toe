'use strict'

const express = require('express');
const SlackClient = require('./client/slack_client');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/error_handler')

let slackClient = new SlackClient();

let app = express();

app.use(bodyParser.json({
  limit: 1024
}));


app.get('/', function(req, res) {
  res.send('Sadman Khan Tic Tac Toe Connection succeded');
});

app.post('/command', function(req, res) {
  let payload = req.body


});


app.use(errorHandler);


// The server gets started from bin/tic_tac_toe.js
module.exports = app;
