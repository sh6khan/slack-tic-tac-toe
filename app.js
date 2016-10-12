'use strict'

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const SlackClient = require('./client/slack_client');
const GameTracker = require('./game_engine/game_tracker');
const allCommands = require('./commands/index');
const errorHandler = require('./middleware/error_handler');
const Constants = require('./constants');

let slackClient = new SlackClient();
let gameTracker = new GameTracker();

let app = express();

slackClient.getAllUsers();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', function(req, res) {
  res.send('Sadman Khan Tic Tac Toe Connection succeded');
});

app.post('/command', function(req, res) {
  let params = req.body
  let command;
  let mainCommand;
  let CommandClass;
  let commandAndArgs;

  console.log(params);

  // completly ignore the message if token does not match
  if (params.token != Constants.MESSAGE_TOKEN) {
    return;
  }

  commandAndArgs = params.text.split(" ")
  mainCommand = commandAndArgs[0]

  CommandClass = allCommands[mainCommand];

  // trigger the uknownCommand Class
  if (!CommandClass) {
    CommandClass = allCommands.unkown;
    command = new CommandClass();
    command.handleCommand(mainCommand, params, res);
    return;
  }

  command = new CommandClass();
  command.handleCommand(gameTracker, params, res);
});


app.use(errorHandler);


// The server gets started from bin/tic_tac_toe.js
module.exports = app;
