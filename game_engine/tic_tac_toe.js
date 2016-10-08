'use strict'

const Board = require('../lib/board');

const Status = {
  ACTIVE: 0,
  PLAYERONE_WINNER: 1,
  PLAYERTWO_WINNER: 2,
  TIE: 4
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
  placeMove(x, y, player) {
    //TODO validate here and return slack message
    // on out of bounds error

    // validate the cell has not already been placed in
    const cell = this.board.get(x, y);

    if (cell) {
      //TODO: Send a slack message indicating that
      // this move has already been placed
    }

    this.board.placeMove(x, y, player)

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
  * Validate move is coming from one of the players an not someone else
  */
  _validate_player(player) {
    if (player != this.playerOne && player != this.playerTwo) {
      throw new Error(player + ' is not one of players of the game');
    }
  }
}

module.exports = TicTacToe;
