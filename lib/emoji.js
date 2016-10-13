'use strict'

/**
 * Emoji namespace
 */
var Emoji = module.exports = {
  emoji: require('./emoji.json')
};

/**
 * get emoji code from name
 *
 * @param emoji {String}
 * @return String
 */
Emoji.get = function _get(emoji) {
  return Emoji.emoji.hasOwnProperty(emoji)
};
