'use strict'

const CommandBase = require('./command_base');
const SlackClient = require('../client/slack_client');

class ChallengeCommand extends CommandBase {
  constructor() {
    super();
    this.slackClient = new SlackClient();
  }

  handleCommand(gameTracker, params, res) {
    let game = gameTracker.find_game(params.channel_id);

    if (game) {
      this._gameAlreadyInChannel(params, res);
      return;
    }

    let args = params.text.split(' ');
    let user = params.username;

    // the challenger did not add a challengee
    if (args.length < 3) {
      this._missingArgs(params, res);
      return;
    }

    // parse the second argument to grab the username
    // ensure that challengee is properly formatted
    let challengee = args[1];
    if (challengee[0] != "@") {
      this._missingArgs(params, res);
      return;
    }
    challengee = challengee.slice(1);

    // check if the user is actually a member of the team
    let challangeeUserId = this.slackClient.getUserId(challengee)
    if (!challangeeUserId) {
      this._notTeamMember(challengee, params, res);
      return;
    }

    // check if the user challenger and challangee are the same
    if (challangeeUserId === params.user_id) {
      this._playingYourself(params, res);
      return;
    }

    if (!this.validateEmoji(args[2])) {
      this._invalidEmoji(args[2], params, res);
      return;
    }

    // Challenger symbol
    let challengerSymbol = args[2];
    let channelId = params.channel_id;
    let challenger = params.user_name;

    gameTracker.broadcastChallenge(channelId, challenger, challengee, challengerSymbol);

    this._announceBroadcast(challengee, params, res);

    return;
  }

  /**
  * message the channel when challenger is missing args
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _missingArgs(params, res) {
    const message = {
      text: '`/ttt challenge [@username] [:emoji:]` to challenge someone' +
            '\n `/ttt challenge @slackbot :cry:` (example)'
    }

    this.messageChannel(message, params.channel_name, res);
  }

  /**
  * message the channel when the challengee is not a team memeber
  *
  * @param challengee {String} - username of challengee
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _notTeamMember(challengee, params, res) {
    const message = {
      text: challengee + ' is not a team member :('
    }

    this.messageChannel(message, params.channel_name, res);
  }

  /**
  * The challenge and the challengee is the same
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _playingYourself(params, res) {
    const message = {
      text: "You can\'t play yourself :/"
    }

    this.messageChannel(message, params.channel_name, res);
  }

  /**
  * success challenge sent
  *
  * @param params {Object} - params received from Slack
  * @param res {Object} - the response object to post back to channel
  */
  _announceBroadcast(challengee, params, res) {
    const message = {
      text: "@" + challengee + "! you have been challenged! " +
            "\n `/ttt accept [:emoji:]` to accept!`"
    }

    this.messageChannel(message, params.channel_name, res);
  }
}

module.exports = ChallengeCommand;
