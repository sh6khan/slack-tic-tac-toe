/**
* this module handles keeping track of and finding
* active games, between two players
*/


let allActiveTicTacToeGames = {}

class GameTracker {
  constructor() {}

  /**
  * Find an active game of tic tac toe between two players in a channel
  */
  find_game(channelId) {
    return allActiveTicTacToeGames[channelId];
  }
}
