'use strict'


class Cell {
  constructor(player) {
    this.symbol = player.symbol;
    this.player = player;
  }
}

module.exports = Cell;
