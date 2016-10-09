'use strict'

const assert = require('assert');
const Board = require('../lib/board');
const Player = require('../lib/player');
const Cell = require('../lib/cell');

suite('board');

test('should be able to Iniitalize a 3 by 3 grid', function() {
  let board = new Board(3);
  let grid = board.grid;

  assert.equal(3, grid.length);
  assert.equal(3, grid[0].length);
});

test('should allow placing moves on the board', function() {
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
});

test('should raise errors if trying to index ouf of range', function(){
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
});

test('should not allow placing the same move twice', function() {
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
});

test('should be able to able to tell the board is full', function() {
  let board = new Board(3);
  let playerOne = new Player("X");
  let playerTwo = new Player("O");

  board.placeMove(0, 0, playerOne);
  board.placeMove(0, 1, playerTwo);
  board.placeMove(0, 2, playerOne);
  board.placeMove(1, 0, playerTwo);
  board.placeMove(1, 1, playerOne);
  board.placeMove(1, 2, playerTwo);
  board.placeMove(2, 0, playerOne);
  board.placeMove(2, 1, playerTwo);
  board.placeMove(2, 2, playerOne);

  assert(board.finished);
});

test('#_is_same_player', function() {
  let board = new Board(3);
  let playerOne = new Player("X");
  let playerTwo = new Player("O");

  let cells = [];

  for(var i = 0; i < 10; i++) {
    cells.push(new Cell(playerOne));
  }

  assert.equal(playerOne, board._is_same_player(cells));

  cells[5] = new Cell(playerTwo);

  assert.equal(null, board._is_same_player(cells));
});

test('should be able determine a horizontal winner', function() {
  let board = new Board(3);
  let playerOne = new Player("X");
  let playerTwo = new Player("O");

  board.placeMove(0, 0, playerOne);
  board.placeMove(0, 1, playerOne);
  board.placeMove(0, 2, playerOne);

  assert.equal(playerOne, board.winner());

  board.clear();

  board.placeMove(1, 0, playerOne);
  board.placeMove(1, 1, playerOne);
  board.placeMove(1, 2, playerOne);

  assert.equal(playerOne, board.winner());

  board.clear();

  board.placeMove(2, 0, playerTwo);
  board.placeMove(2, 1, playerTwo);
  board.placeMove(2, 2, playerTwo);

  assert.equal(playerTwo, board.winner());

  board.clear();

  board.placeMove(0, 0, playerOne);
  board.placeMove(1, 1, playerOne);
  board.placeMove(0, 2, playerOne);

  assert.equal(null, board.winner());
});

test('should be able to determine vertial winner', function() {
  let board = new Board(3);
  let playerOne = new Player("X");
  let playerTwo = new Player("O");

  board.placeMove(0, 0, playerOne);
  board.placeMove(1, 0, playerOne);
  board.placeMove(2, 0, playerOne);

  assert.equal(playerOne, board.winner());

  board.clear();

  board.placeMove(2, 1, playerOne);
  board.placeMove(1, 1, playerOne);
  board.placeMove(0, 1, playerOne);

  assert.equal(playerOne, board.winner());

  board.clear();

  board.placeMove(0, 2, playerTwo);
  board.placeMove(2, 2, playerTwo);
  board.placeMove(1, 2, playerTwo);

  assert.equal(playerTwo, board.winner());

  board.clear();

  board.placeMove(0, 0, playerOne);
  board.placeMove(1, 1, playerOne);
  board.placeMove(1, 2, playerOne);

  assert.equal(null, board.winner());
});

test('should be able to determine diag winner', function() {
  let board = new Board(3);
  let playerOne = new Player("X");
  let playerTwo = new Player("O");

  board.placeMove(0, 0, playerOne);
  board.placeMove(1, 1, playerOne);
  board.placeMove(2, 2, playerOne);

  assert.equal(playerOne, board.winner());

  board.clear();

  board.placeMove(0, 0, playerOne);
  board.placeMove(1, 1, playerOne);
  board.placeMove(0, 2, playerOne);

  assert.equal(null, board.winner());

  board.clear();

  board.placeMove(0, 2, playerTwo);
  board.placeMove(1, 1, playerTwo);
  board.placeMove(2, 0, playerTwo);

  assert.equal(playerTwo, board.winner());
});
