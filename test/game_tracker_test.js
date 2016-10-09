'use strict'

const assert = require('assert');
const GameTracker = require('../game_engine/game_tracker');

suite('GameTracker');

test('should be able to broadcast a game', function() {
  let gameTracker = new GameTracker();

  gameTracker.broadcastChallenge(1, "sadman", "khan", ":parrot:");
  gameTracker.broadcastChallenge(1, "steve", "jobs", ":100:");
  gameTracker.broadcastChallenge(1, "tim", "cook", ":fire:");
});

test('should be able to accept a game', function() {
  let gameTracker = new GameTracker();

  let players = gameTracker.acceptChallenge(1, "khan");

  assert.deepEqual({
    challenger: "sadman",
    challengee: "khan",
    challengerSymbol: ":parrot:"
  }, players);

  // once someone has accepted a challenge on a channel
  // all other broadcastedGames should be cleared
  players = gameTracker.acceptChallenge(1, "jobs");
  assert.equal(undefined, players);
});
