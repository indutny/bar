var vows = require('vows'),
    assert = require('assert');

var bar = require('../lib/bar');

vows.describe('Bar').addBatch({
  'Calling bar.create()': {
    topic: function() {
      return bar.create(__dirname + '/data');
    },
    'should create bar.Bar instance': function(I) {
      assert.instanceOf(I, bar.Bar);
    }
  }
}).export(module);
