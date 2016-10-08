'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const SlackClient = require('./client/slack_client');
const GameTracker = require('./game_engine/game_tracker');
const allCommands = require('./commands/index');
const errorHandler = require('./middleware/error_handler');

let slackClient = new SlackClient();
let gameTracker = new GameTracker();

let app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', function(req, res) {
  res.send('Sadman Khan Tic Tac Toe Connection succeded');
});

app.post('/command', function(req, res) {
  let params = req.body

  let commandAndArgs = params.text.split(" ")
  let mainCommand = commandAndArgs[0]

  let CommandClass = allCommands[mainCommand];
  let command = new CommandClass();

  let game = gameTracker.find_game(params.channel_id);

  command.hanldeCommand(game, params, res);
});


app.use(errorHandler);


// The server gets started from bin/tic_tac_toe.js
module.exports = app;
