'use strict'

const Cell = require('./cell')

/**
* This is the board class that  maintains the state of
* the current game. The board if made out of cell objects.
* This board class is also designed to be a general board
* it can be instantiated to be any m by m size
*/

class Board {
  constructor(x) {
    // define the length and width of the
    // square board
    this.size = x;

    // the variable keep track of how full
    // the board is
    this.filledCount = 0

    // build the board with a two dimensional Array of Cell objects
    // all of the cell objects are initialized to be nil
    this.grid = new Array(this.size);
    for (var i = 0; i < this.size; i++) {
      this.grid[i] = new Array(this.size);
    }
  }

  /**
  * Determine if one of the players is a winner
  * @return Player
  */
  winner() {
    let horizontalWinner = _checkHorizontal();
    let verticalWinner = _checkVertical();
    let diagWinner = _checkDiag();

    if (horizontalWinner) {
      return horizontalWinner;
    }

    if (verticalWinner) {
      return horizontalWinner;
    }

    if (diagWinner) {
      return horizontalWinner;
    }

    // no winner
    return null
  }

  /**
  * get the Cell object based on the X and Y coordinates given
  * @return Cell
  */
  get(x, y) {
    this._validate_index(x, y);
    return this.grid[x][y];
  }

  grid() {
    return this.grid;
  }

  /**
  * Place a player move on the board based on the x and y coridinate
  * @param x {Int} - the X coordinate to be placed on the board
  * @param y {Int} - the Y coordinate to be placed on the board
  * @param player {Player} - the player making the move
  */
  placeMove(x, y, player) {
    this._validate_index(x, y);

    var cell = this.get(x, y);

    if (cell) {
      throw new Error('Cell already placed');
    }

    cell = new Cell(player);
    this.grid[x][y] = cell;
  }

  /**
  * Check to see if all elements on the board has een placed
  * @return Boolean - True if board is full
  */
  finished() {
    return this.filledCount == this.size * this.size;
  }

  /**
  * check each horizontal to see if there is a winner
  * @return Player - if there is a winner
  * @return null - if there is no winner
  */
  _checkHorizontal() {
    let cells = []

    for(var row = 0; row < this.size; row++) {
      for(var col = 0; col < this.size; col++) {
        cells.append(this.get(row, col));
      }
    }

    const winner = _are_same_values(cells);

    if (winner) {
      return winner;
    }
  }

  /**
  * check each vertical to see if there is a winner
  * @return Player - if there is a winner
  * @return null - if there is no winner
  */
  _checkVertical() {
    let cells = [];

    for(var col = 0; col < this.size; col++) {
      for(var row = 0; row < this.size; row++) {
        cells.append(this.get(row, col));
      }
    }

    const winner = _are_same_values(cells);

    if (winner) {
      return winner
    }
  }

  /**
  * check the diagonal on the board to see if there is a winner
  * This is a generic m by m board, therefore to win on the diagonal
  * we must check the full diagonal
  *
  * @return Player - if there is a winner
  * @return null - if there is no winner
  */
  _checkDiag() {
    let cells = [];

    for(var i = 0; i < this.size; i++) {
      var col = i;
      var row = this.size - i;
      cells.append(this.get(row, col));
    }

    const winner = _are_same_values(cells);

    if (winner) {
      return winner;
    }
  }

  /**
  * This routine will check to see if every cell
  * has the same symbol, therefore we have a winner
  * @return Player - if winner
  * @return null - if no winner
  */
  _are_same_values(array){
      count = array.uniq
      if (count == 0) {
        return array;
      }
  }

  /**
  * validate out of range index's on the board
  * index logic should be handled at a higher level
  * returning error messages to the users. If we recieve
  * an out of index issue here, throw the error
  */
  _validate_index(x, y) {
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) {
      throw new Error('Out of index x:' + x + ' or y:' + y + ' on grid error');
    }
  }
}

module.exports = Board;
