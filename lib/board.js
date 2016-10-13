'use strict'

const Cell = require('./cell')

/**
* This is the board class that  maintains the state of
* the current game. The board if made out of cell objects.
* This board class is also designed to be a general board
* it can be instantiated to be any m by m size
*
* Even though this board is generic the rules for winning
* will only apply to boards that are 3 by 3 for Tic Tac Toe
*/

class Board {
  constructor(x) {
    // define the length and width of the
    // square board
    this.size = x;

    // keep track of how full the board is
    this.filledCount = 0

    // build the board with a two dimensional Array of Cell objects
    // all of the cell objects are initialized to be nil
    this.clear();
  }

  /**
  * Determine if one of the players is a winner
  *
  * @return Player - if winner
  * @return null - if no winner
  */
  winner() {
    let horizontalWinner = this._checkHorizontal();
    if (horizontalWinner) {
      return horizontalWinner;
    }

    let verticalWinner = this._checkVertical();
    if (verticalWinner) {
      return verticalWinner;
    }


    let diagWinner = this._checkDiag();
    if (diagWinner) {
      return diagWinner;
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

  /**
  * Clear the entire board
  */
  clear() {
    this.grid = new Array(this.size);
    for (var i = 0; i < this.size; i++) {
      this.grid[i] = new Array(this.size);
    }
  }

  /**
  * Place a player move on the board based on the x and y coridinate
  *
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

    this.filledCount++;
  }

  /**
  * Check to see if all elements on the board has een placed
  * @return Boolean - True if board is full
  */
  finished() {
    return this.filledCount == 9
  }

  /**
  * return the index of all the elements in the grid that has
  * not been marked yet
  * @return Array<Array>
  */
  freeCells() {
    let freeCells = [];
    let cell;

    for(var row = 0; row < this.size; row++) {
      for(var col = 0; col < this.size; col++) {
        cell = this.get(row, col);

        if (!cell) {
          freeCells.push([row, col]);
        }
      }
    }

    return freeCells;
  }

  /**
  * check each horizontal to see if there is a winner
  *
  * @return Player - if there is a winner
  * @return null - if there is no winner
  */
  _checkHorizontal() {
    let cells = [];
    let winner;
    for (var i = 0; i < 3; i++) {
      cells = [this.get(i, 0), this.get(i, 1), this.get(i, 2)];
      winner = this._is_same_player(cells);
      if (winner) { return winner; }
    }

    return null;
  }

  /**
  * check each vertical to see if there is a winner
  *
  * @return Player - if there is a winner
  * @return null - if there is no winner
  */
  _checkVertical() {
    let cells = [];
    let winner;

    for (var i = 0; i < 3; i++) {
      cells = [this.get(0, i), this.get(1, i), this.get(2, i)];
      winner = this._is_same_player(cells);
      if (winner) { return winner; }
    }

    return null;
  }

  /**
  * This function will check the two diagonals of the board
  * to determine if there is a winner
  *
  * @return Player - if there is a winner
  * @return null - if there is no winner
  */
  _checkDiag() {
    let cells = [this.get(0,0), this.get(1,1), this.get(2,2)];
    let winner = this._is_same_player(cells);
    if (winner) { return winner; }

    cells = [this.get(0,2), this.get(1,1), this.get(2,0)];
    winner = this._is_same_player(cells);
    if (winner) { return winner; }

    return null;
  }

  /**
  * This routine will check to see if every cell
  * has the same symbol, therefore we have a winner
  *
  * @return Player - if winner
  * @return null - if no winner
  */
  _is_same_player(array){
      const initial = array[0];
      let cell;

      for(var i = 0; i < array.length; i++) {
        cell = array[i];
        if (cell == undefined || cell.player != initial.player) {
          return null;
        }
      }

      return initial.player;
  }

  /**
  * validate out of range index's on the board
  * index logic should be handled at a higher level
  * returning error messages to the users. If we recieve
  * an out of index issue here, throw the error
  *
  * @param x {Int} - row index
  * @param y {Int} - col index
  */
  _validate_index(x, y) {
    if (x < 0 || y < 0 || x >= this.size || y >= this.size) {
      throw new Error('Out of index row:' + x + ' or col:' + y + ' on grid error');
    }
  }
}

module.exports = Board;
