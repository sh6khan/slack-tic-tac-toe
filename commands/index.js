'use strict';

const allCommands = {
  "help": require('./help'),
  "unkown": require('./unkown_command'),
  "challenge": require('./challenge'),
  "accept": require('./accept'),
  "quit": require('./quit'),
  "status": require('./status'),
  "move": require('./move')
}

module.exports = allCommands;
