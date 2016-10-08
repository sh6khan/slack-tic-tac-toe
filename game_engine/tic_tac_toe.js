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
  }

  /**
  * Place a player move on the board based on the x and y coordinate
  *                                                                                      dinate
  * @param x {Int} - the X coordinate to be placed on the board
  * @param y {Int} - the Y coordinate to be placed on the board
  * @param player {Player} - the player making the move
  */
  placeMove(move, player) {
    let index = MoveMapping[move];
    let row = index[0];
    let col = index[1];

    //TODO validate here and return slack message
    // on out of bounds error

    // validate the cell has not already been placed in
    const cell = this.board.get(row, col);

    if (cell) {
      //TODO: Send a slack message indicating that
      // this move has already been placed
    }

    this.board.placeMove(row, col, player)

    // after placing a move on the board
    // check to see if there is a winner
    player = this.board.winner();


    // if (player) {
    //   //TODO: message winner in slack channel
    // }
  }

  /**
  * Declare the player as the winner and update their global score
  * according to a simplefied chess algoirthm
  */
  winner(player) {
    console.log(player + ' is the winner !');
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
  * Validate move is coming from one of the players an not someone else
  */
  _validate_player(player) {
    if (player != this.playerOne && player != this.playerTwo) {
      throw new Error(player + ' is not one of players of the game');
    }
  }
}

module.exports = TicTacToe;
