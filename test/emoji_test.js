'use strict'

const Emoji = require('../lib/emoji');
const assert = require('assert');

suite('Emoji Test')

test('should have emoji', function() {
  assert.equal(false, Emoji.get("random"));
  assert(Emoji.get("cry"));
  assert(Emoji.get("fire"));
})
