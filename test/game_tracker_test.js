'use strict'

const assert = require('assert');
const GameTracker = require('../game_engine/game_tracker');
const Player = require('../lib/player');
const TicTacToe = require('../game_engine/tic_tac_toe');

suite('GameTracker');

test('should be able to broadcast a game', function() {
  let gameTracker = new GameTracker();

  gameTracker.broadcastChallenge(1, "sadman", "khan", ":cry:");
  gameTracker.broadcastChallenge(1, "steve", "jobs", ":100:");
  gameTracker.broadcastChallenge(1, "tim", "cook", ":fire:");
});

test('should be able to accept a game', function() {
  let gameTracker = new GameTracker();

  let players = gameTracker.findChallenge(1, "khan");
  gameTracker.acceptChallenge(1);

  assert.deepEqual({
    challenger: "sadman",
    challengee: "khan",
    challengerSymbol: ":cry:"
  }, players);

  // once someone has accepted a challenge on a channel
  // all other broadcastedGames should be cleared
  players = gameTracker.findChallenge(1, "jobs");
  assert.equal(undefined, players);
});

test('should be able to start a game', function() {
  let gameTracker = new GameTracker();
  let playerOne = new Player(":fire:", "sadman");
  let playerTwo = new Player(":100:", "obama");
  let game = new TicTacToe(playerOne, playerTwo);

  gameTracker.gameStarted(2, game);

  assert.equal(game, gameTracker.find_game(2));
});

test('it should be able to remove a game', function() {
  let gameTracker = new GameTracker();

  let game = gameTracker.find_game(2);
  gameTracker.removeGame(2, game);
  assert.equal(null, gameTracker.find_game(2));
});
