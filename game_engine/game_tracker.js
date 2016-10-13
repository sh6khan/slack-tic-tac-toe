'use strict'

/**
* this module handles keeping track of and finding
* active games, between two players
*
* When a user challenges another user to a game, the challengee has to
* first accept the match and pick their symbol before the game will start.
* In the mean time, a different user can broadcast a challenge on the same
* channel and the game that gets started is the game that is first accepted
*/


let allActiveTicTacToeGames = {}
let broadcastedGames = {}

class GameTracker {
  constructor() {}


  /**
  * Keep a global in memory hash of all challenges broadcasted on a channel
  *
  * @param channelId {Int} - the channelId the game is being broadcaseted on
  * @param challenger {String} - the username of the challenger
  * @param challengee {String} - the username of the challengee
  */
  broadcastChallenge(channelId, challenger, challengee, symbol) {
    broadcastedGames[channelId] = broadcastedGames[channelId] || [];

    broadcastedGames[channelId].push({
      challenger: challenger,
      challengerSymbol: symbol,
      challengee: challengee
    });
  }

  /**
  * If the challengee has accepted the challeng, all other broadcasted games
  * on this channel will be deleted
  *
  * @param channelId {Int}
  * @param challengee {String} - the username of the challengee
  */
  acceptChallenge(channelId) {
    if (!channelId) {
      throw new Error('missing param channelId')
    }

    broadcastedGames[channelId] = []
  }

  /**
  * Given a channel_id and a challengee find a broadcasted challenge
  * Do not start the challenge
  *
  * @param channelId {Int}
  * @param challengee {String} - the username of the challengee
  */
  findChallenge(channelId, challengee) {
    if (!broadcastedGames[channelId]) {
      return;
    }

    let gamePlayers = null

    broadcastedGames[channelId].forEach(function(players) {
      if (challengee == players.challengee) {
        gamePlayers = players;
        return;
      }
    });

    return gamePlayers;
  }

  /**
  * Find all the broadcasted games in one channel
  *
  * @param channelId {Int}
  * @return Array<Hash>
  */
  findBroadcastedGames(channelId) {
    return broadcastedGames[channelId];
  }


  /**
  * Find an active game of tic tac toe between two players in a channel
  *
  * @param channelId
  * @return TicTacToe - if there is an active game on that channel
  */
  find_game(channelId) {
    return allActiveTicTacToeGames[channelId];
  }

  /**
  * Set an active game for the channel
  *
  * @param channelId {Int}
  * @param game {TicTacToe}
  */
  gameStarted(channelId, game) {
    if (allActiveTicTacToeGames[channelId]) {
      throw new Error('There is already a game on this channel');
    }

    allActiveTicTacToeGames[channelId] = game
  }

  /**
  * remove active game from channel if the game is over
  *
  * @param channelId {Int}
  * @param game {TicTacToe}
  */
  removeGame(channelId, game) {
    if (!allActiveTicTacToeGames[channelId]) {
      throw new Error('Active game for channel:' + channelId + ' not found');
    }

    if (game != allActiveTicTacToeGames[channelId]) {
      throw new Error('Game does not match');
    }

    allActiveTicTacToeGames[channelId] = null;
  }
}

module.exports = GameTracker;
