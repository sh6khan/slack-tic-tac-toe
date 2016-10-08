'use strict'


class Cell {
  consturctor(player) {
    this.symbol = player.symbol;
    this.player = player;
  }

  /**
  * Set the value of the symbol
  */
  get() {
    return this.symbol;
  }
}

module.exports = Cell;
