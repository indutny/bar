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
  this.drinkersByName = {};

  /**
   * Store options
   */
  this.options = options = bar.utils.merge({
    EventEmitter: require('eventemitter2').EventEmitter2
  }, options);

  /**
   * Pool for all pints
   */
  this.pool = new options.EventEmitter();

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

  this.log('Node.js Bar Is Open');
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
    fs.stat(file, function(err, stat) {
      if (!stat.isFile()) return;
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
        that.leave(file);

        var drinker = bar.drinker.create(file, content, that);
        that.drinkers[drinker.name] = that.drinkers[file] = drinker;

        that.log(' > %s enters bar', drinker.name);
      });
    });
  });
};

/**
 * Remove file
 */
Bar.prototype.leave = function(drinker) {
  if (this.drinkers[drinker]) {
    var name = this.drinkers[drinker].name;
    this.pool.emit('leave.' + name);

    this.log(' < %s leaves bar', name);

    /**
     * Remove drinkers by name and filename from hashmap
     */
    this.drinkers[drinker] = this.drinkers[name] = null;
  }
};

/**
 * Log errors
 */
Bar.prototype.log = function() {
  console.log.apply(console, arguments);
};
