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

  game.placeMove("A", playerOne);
  game.placeMove("D", playerTwo);
  game.placeMove("E", playerOne);
  game.placeMove("G", playerTwo);
  game.placeMove("H", playerOne);
  
  done();
});

test('it should be able to show remaining cells', function(done) {
  let playerOne = new Player("X");
  let playerTwo = new Player("O");
  let game = new TicTacToe(playerOne, playerTwo);


  game.placeMove("A", playerOne);
  game.placeMove("D", playerTwo);
  game.placeMove("E", playerOne);
  game.placeMove("G", playerTwo);
  game.placeMove("H", playerOne);

  let expected = ["B", "C", "F", "I"];
  assert.deepEqual(expected, game.remainingMoves());

  done();
});
