'use strict'

const assert = require('assert');
const Board = require('../lib/board');
const Player = require('../lib/player');

suite('board');

test('should be able to Iniitalize a 3 by 3 grid', function(done) {
  let board = new Board(3);
  let grid = board.grid;

  assert.equal(3, grid.length);
  assert.equal(3, grid[0].length);

  done();
});

test('should allow placing moves on the board', function(done) {
  let board = new Board(3);
  let playerOne = new Player("X");
  let playerTwo = new Player("O");

  board.placeMove(0,0, playerOne);
  board.placeMove(1,1, playerTwo);
  board.placeMove(2,1, playerOne);

  let cell = board.get(0,0);
  assert("X", cell.symbol);
  assert(playerOne, cell.player);

  cell = board.get(1,1);
  assert("O", cell.symbol);
  assert(playerTwo, cell.player);

  cell = board.get(2, 1);
  assert("X", cell.symbol);
  assert(playerOne, cell.player);

  done();
});

test('should raise errors if trying to index ouf of range', function(done){
  let board = new Board(3);
  let playerOne = new Player("X");
  let playerTwo = new Player("O");

  assert.throws(function() {
    board.placeMove(-1, -1, playerOne);
  });

  assert.throws(function() {
    board.placeMove(2, 4, playerOne);
  });

  assert.throws(function() {
    board.placeMove(5, -1, playerOne);
  });

  done();
});

test('should not allow placing the same move twice', function(done) {
  let board = new Board(3);
  let playerOne = new Player("X");
  let playerTwo = new Player("Y");

  board.placeMove(0, 0, playerOne);

  assert.throws(function() {
    board.placeMove(0, 0, playerOne);
  });

  assert.throws(function() {
    board.placeMove(0, 0, playerTwo);
  });

  done();
});
