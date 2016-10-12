'use strict'

/**
 * Emoji namespace
 */
var Emoji = module.exports = {
  emoji: require('./emoji.json')
};

/**
 * get emoji code from name
 * @param  {string} emoji
 * @return {string}
 */
Emoji.get = function _get(emoji) {
  return Emoji.emoji.hasOwnProperty(emoji)
};
