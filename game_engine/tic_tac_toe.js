'use strict'

const Board = require('../lib/board');

class TicTacToe {
  consturctor(player1, player2) {
    // Iniitalize a 3 by 3 board
    this.board = Board.new(3)
  }

  /**
  * Place a player move on the board based on the x and y coor                                                                                     dinate
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
    player = this.board.winner
    return player

    // if (player) {
    //   //TODO: message winner in slack channel
    // }
  }

  /**
  * Declare the player as the winner and update their global score
  * according to a simplefied chess algoirthm
  */
  winner(player) {

  }



}
