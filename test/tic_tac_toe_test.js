'use strict'

const assert = require('assert');
const Player = require('../lib/player');
const TicTacToe = require('../game_engine/tic_tac_toe');

suite('TicTacToe');

test('it should Iniitalize a 3 by 3 board for tic tac toe', function(done) {
  let playerOne = new Player("X");
  let playerTwo = new Player("O");
  let game = new TicTacToe(playerOne, playerTwo);

  assert.equal(3, game.board.grid.length);
  assert.equal(3, game.board.grid[0].length);

  done();
});

test('it should allow placing moves for the game', function(done) {
  let playerOne = new Player("X");
  let playerTwo = new Player("O");
  let game = new TicTacToe(playerOne, playerTwo);

  game.placeMove(0, 0, playerOne);
  game.placeMove(1, 1, playerTwo);
  game.placeMove(1, 0, playerOne);
  game.placeMove(2, 2, playerTwo);
  game.placeMove(2, 0, playerOne);

  done();
});
