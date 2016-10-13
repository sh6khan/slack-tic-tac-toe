'use strict'

/**
* The board class is composed of Cell objects
* each cell is associated with a player and the player
* symbol
*/

class Cell {
  constructor(player) {
    this.symbol = player.symbol;
    this.player = player;
  }
}

module.exports = Cell;
