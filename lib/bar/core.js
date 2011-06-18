/**
 * Node.js Bar Module
 *
 * Core
 */

var core = exports;

var fs = require('fs'),
    watch = require('watch');

var bar = require('../bar');

/**
 * Bar @constructor
 */
function Bar(dir, options) {
  var that = this;

  /**
   * Drinkers in a Bar
   */
  this.drinkers = {};

  /**
   * Store options
   */
  this.options = options = bar.utils.merge({
    drinker: {
    }
  }, options);

  /**
   * Monitor file changes in directory
   */
  watch.watchTree(dir, function(f, curr, prev) {
    if (curr !== null && curr.nlink === 0) {
      /**
       * File was removed
       */
       that.leave(f);
    } else {
      /**
       * File was updated/created
       */
       that.enter(curr === null ? Object.keys(f) : [f]);
    }
  });
};
core.Bar = Bar;

/**
 * Constructor wrapper
 */
function create(dir, options) {
  return new Bar(dir, options);
};
core.create = create;

/**
 * Add files
 */
Bar.prototype.enter = function(drinkers) {
  var that = this;

  drinkers.forEach(function(file) {
    /**
     * Load each file
     */
    fs.readFile(file, function(err, content) {
      if (err) {
        that.log('Failed to load file %s', file, err);
        return;
      };

      /**
       * Convert content from Buffer to String
       */
      content = content.toString();

      /**
       * If that drinker was already here
       * Kick him out and let one come in
       */
      if (that.drinkers[file]) {
        that.drinkers[file].emit('kick');
      }

      that.drinkers[file] = bar.drinker.create(file, content,
                                               that.options.drinker);
    });
  });
};

/**
 * Remove file
 */
Bar.prototype.leave = function(drinker) {
};

/**
 * Log errors
 */
Bar.prototype.log = function() {
  console.log.apply(console, arguments);
};
