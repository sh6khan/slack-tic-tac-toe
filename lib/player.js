'use strict'

/**
* Player classes are created from info received from Slack
* each player associates their own symbol which is used to
* create the Cell on the board
*/

class Player {
  constructor(symbol, username) {
    this.symbol = symbol;
    this.username = username;
  }
}

module.exports = Player;
