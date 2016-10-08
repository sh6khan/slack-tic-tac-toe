'use strict'

const Slack = require('slack');
const Constants = require('../constants');

/**
* This file is a wrapper around the Slack client
* and it handles sending messages to the slack channel
*/

class SlackClient {
  constructor() {
    this.teamUsers = {};
    this._getAllUsers();
  }

  /**
  * A check the channels users to see if a use exists inside
  * the user list
  *
  * @return Boolean - True if user exists
  */
  isUser(name) {
    return this.teamUsers[name] != undefined
  }

  /**
  * Grab all users from the Slack team and store the data
  * in memory under the channelUsers class variable
  */
  _getAllUsers() {
    let token = Constants.SLACK_API_TOKEN || 'local test token';
    var self = this;

    Slack.users.list({token: token}, function(err, data) {

      if (err) {
        console.log(err);
        throw new Error('Received Error from Slack', err);
      }


      const members = data.members
      let member;

      // place in members in teamUsers
      for(var i = 0; i < members.length; i++) {
        member = members[i];
        self.teamUsers[member.name] = member.id;
      }
    });
  }
}

module.exports = SlackClient;
