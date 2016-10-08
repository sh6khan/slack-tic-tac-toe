'use strict'

/**
* this module handles keeping track of and finding
* active games, between two players
*/


let allActiveTicTacToeGames = {}

class GameTracker {
  constructor() {}

  /**
  * Find an active game of tic tac toe between two players in a channel
  * @return TicTacToe - if there is an active game on that channel
  */
  find_game(channelId) {
    return allActiveTicTacToeGames[channelId];
  }

  /**
  * Set an active game for the channel
  */
  game_started(channelId, game) {
    if (allActiveTicTacToeGames[channelId]) {
      throw new Error('There is already a game on this channel');
    }

    allActiveTicTacToeGames[channelId] = game
  }

  /**
  * remove active game from channel if the game is over
  */
  remove_game(channelId, game) {
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
