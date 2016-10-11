'use strict'

const Slack = require('slack');
const Constants = require('../constants');


/**
* This file is a wrapper around the Slack client.
* It handles grabbing all the users from the slack channel
* and storing it a global in-memory hash
*/

let teamUsers = {}
let allEmoji = {}

class SlackClient {
  constructor() {
    this.token = Constants.SLACK_API_TOKEN;
  }

  /**
  * return the userId associated with a slack username
  *
  * @param username {String} - username
  * @return Int - if the user exists
  * @return undefined - if user does not exist
  */
  getUserId(username) {
    return teamUsers[username];
  }

  /**
  * Get the url of the emoji
  *
  * @param emoji {String}
  * @return String
  */
  findEmoji(emoji) {
    return allEmoji[emoji];
  }

  /**
  * This game allows to use emojis as symbols
  * for cells
  */
  getAllEmojis(cb) {
    var self = this;

    cb = cb || function() {};

    Slack.emoji.list({token: self.token}, function(err, data) {
      // This is not an error that we should be passing
      // back up the call stack as it is very critical
      if (err) {
        console.log(err);
        //throw new Error('Received Error from Slack', err);
        return cb();
      }

      allEmoji = data.emoji;

      cb();
    });
  }

  /**
  * Grab all users from the Slack team and store the data
  * in memory under the teamUsers global variable
  */
  getAllUsers(cb) {
    var self = this;

    cb = cb || function() {};

    Slack.users.list({token: self.token}, function(err, data) {
      // This is not an error that we should be passing
      // back up the call stack as it is very critical
      if (err) {
        console.log(err);
        //throw new Error('Received Error from Slack', err);
        return cb();
      }

      const members = data.members
      let member;

      // place members in teamUsers
      for(var i = 0; i < members.length; i++) {
        member = members[i];
        teamUsers[member.name] = member.id;
      }

      cb();
    });
  }
}

module.exports = SlackClient;
