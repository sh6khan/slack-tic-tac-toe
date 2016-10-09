'use strict'

const assert = require('assert');
const Player = require('../lib/player');
const TicTacToe = require('../game_engine/tic_tac_toe');

suite('TicTacToe');

test('it should Iniitalize a 3 by 3 board for tic tac toe', function() {
  let playerOne = new Player("X");
  let playerTwo = new Player("O");
  let game = new TicTacToe(playerOne, playerTwo);

  assert.equal(3, game.board.grid.length);
  assert.equal(3, game.board.grid[0].length);
});

test('it should validate the right player is placing the move', function() {
  let playerOne = new Player("X");
  let playerTwo = new Player("O");
  let game = new TicTacToe(playerOne, playerTwo);
  let result;

  result = game.placeMove("A", playerOne);
  assert.deepEqual({
    winner: false,
    tied: false,
    err: null
  }, result);

  result = game.placeMove("B", playerOne);
  assert.deepEqual({
    winner: false,
    tied: false,
    err: 'Wrong Player'
  }, result);
});

test('it should validate placing the same move twice', function() {
  let playerOne = new Player("X");
  let playerTwo = new Player("O");
  let game = new TicTacToe(playerOne, playerTwo);

  game.placeMove("A", playerOne);

  let result = game.placeMove("A", playerTwo);
  assert.deepEqual({
    winner: false,
    tied: false,
    err: 'Cell full'
  }, result);
});

test('it should validate invalid moves', function() {
  let playerOne = new Player("X");
  let playerTwo = new Player("O");
  let game = new TicTacToe(playerOne, playerTwo);

  let result = game.placeMove("RR", playerOne);

  assert.deepEqual({
    winner: false,
    tied: false,
    err: 'Invalid move'
  }, result);
});


test('it should allow placing moves for the game', function() {
  let playerOne = new Player("X");
  let playerTwo = new Player("O");
  let game = new TicTacToe(playerOne, playerTwo);

  game.placeMove("A", playerOne);
  game.placeMove("D", playerTwo);
  game.placeMove("E", playerOne);
  game.placeMove("G", playerTwo);
  game.placeMove("H", playerOne);
});

test('it should be able to show remaining cells', function() {
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
});
