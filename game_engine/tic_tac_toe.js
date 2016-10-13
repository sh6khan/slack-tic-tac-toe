'use strict'

const Board = require('../lib/board');

const Status = {
  ACTIVE: 0,
  PLAYERONE_WINNER: 1,
  PLAYERTWO_WINNER: 2,
  TIE: 4
}

const MoveMapping = {
  "A": [0,0],
  "B": [0,1],
  "C": [0,2],
  "D": [1,0],
  "E": [1,1],
  "F": [1,2],
  "G": [2,0],
  "H": [2,1],
  "I": [2,2],
}

const ReverseMoveMapping = {
  0: {
    0: "A",
    1: "B",
    2: "C"
  },
  1: {
    0: "D",
    1: "E",
    2: "F"
  },
  2: {
    0: "G",
    1: "H",
    2: "I"
  }
}

class TicTacToe {
  constructor(playerOne, playerTwo) {
    // Iniitalize a 3 by 3 board
    this.board = new Board(3);
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;

    // set the current player to be playerOne
    this.players = [playerOne, playerTwo];
    this.currentPlayer = playerOne;

    // set the state of the game object
    this.state = Status.ACTIVE;
  }

  /**
  * Place a player move on the board.
  *
  * @param move {String} - let letter mapping to a coordinate on the board
  * @param player {Player} - the player making the move
  */
  placeMove(move, player) {
    let results = {
      winner: false,
      tied: false,
      err: null,
    }

    if (player != this.currentPlayer) {
      results.err = 'Wrong Player';
      return results;
    }


    // handle illegal moves
    let index = MoveMapping[move];
    if (!index) {
      results.err = "Invalid move";
      return results;
    }

    let row = index[0];
    let col = index[1];

    // validate the cell has not already been placed in
    const cell = this.board.get(row, col);
    if (cell) {
      results.err = "Cell full";
      return results;
    }


    this.board.placeMove(row, col, player)

    // after placing a move on the board
    // check to see if there is a winner
    player = this.board.winner();

    // if player object is not null that means we have a winner
    // update the state of the game object
    if (player) {
      this._winner(player);
      results.winner = true
      return results;
    }

    // handle case where the latest move, tied the game
    if (this.board.finished()) {
      this._tied();
      results.tied = true;
      return results;
    }

    // if we reached here, the game is still active
    // swap currentPlayer and continue the game
    this._swapPlayer();

    return results;
  }

  /**
  * Generate a text representation of the current board
  * @return String
  */
  generateBoardText() {
    let cells = [];
    let cell;
    for(var row = 0; row < this.board.size; row++) {
      for(var col = 0; col < this.board.size; col++) {
        cell = this.board.get(row, col);

        if (cell == undefined) {
          cell = "   " + ReverseMoveMapping[row][col] + "  "
        } else {
          cell = cell.symbol;
        }

        cells.push(cell);
      }
    }

    let board =
     cells[0] + '   |   ' + cells[1] + '   |   ' + cells[2] +
    '\n---------------------' +
    '\n' + cells[3] + '   |   ' + cells[4] + '   |   ' + cells[5] +
    '\n---------------------' +
    '\n' + cells[6] + '   |   ' + cells[7] + '   |   ' + cells[8];

    return board;
  }


  /**
  * Determine the free cells for the current game
  * @return Array<String>
  */
  remainingMoves() {
    let remainingMoves = [];
    let freeCells = this.board.freeCells();
    let row;
    let col;

    freeCells.forEach(function(cellIndex) {
      row = cellIndex[0];
      col = cellIndex[1];

      remainingMoves.push(ReverseMoveMapping[row][col]);
    });

    return remainingMoves;
  }

  /**
  * Declare the player as the winner and update
  * the state of the current game
  *
  * @param player {Player}
  */
  _winner(player) {
    this.state = player == this.players[0] ? Status.PLAYERONE_WINNER : Status.PLAYERTWO_WINNER
  }

  /**
  * Update the state of the game to be tied
  */
  _tied() {
    this.state = Status.TIE
  }

  /**
  * this function swaps the currentPlayer class variable to the other
  * player
  */
  _swapPlayer() {
    if (this.currentPlayer == this.players[0]) {
      this.currentPlayer = this.players[1];
    } else {
      this.currentPlayer = this.players[0];
    }
  }

  /**
  * Validate move is coming from one of the players an not someone else
  *
  * @param player {Player}
  */
  _validate_player(player) {
    if (player != this.playerOne && player != this.playerTwo) {
      throw new Error(player + ' is not one of players of the game');
    }
  }
}

module.exports = TicTacToe;
