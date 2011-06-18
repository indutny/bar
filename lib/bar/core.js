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
   * Wait list for drinkers
   */
  this.waitList = {};

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

        /**
         * Welcome drinker!
         */
        drinker.emit('enter.' + drinker.name);

        /**
         * Notify waiters about new drinker
         */
        that.notifyWaiters(drinker.name);
        that.notifyWaiters(file);
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
    this.drinkers[name].pint.emit('kicked.' + name);

    /**
     * Remove drinkers by name and filename from hashmap
     */
    this.drinkers[drinker] = this.drinkers[name] = null;
  }
};

/**
 * Wait for drinker to enter bar
 */
Bar.prototype.waitFor = function(name, callback) {
  if (this.drinkers[name]) return process.nextTick(callback);

  /**
   * Add callback to waitList
   */
  var waitList = this.waitList[name] || (this.waitList[name] = []);
  waitList.push(callback);
};

/**
 * Notify waiters about new drinker
 */
Bar.prototype.notifyWaiters = function(name) {
  if (!this.waitList[name]) return;
  this.waitList[name].forEach(function(fn) {
    fn();
  });
  this.waitList[name] = null;
};

/**
 * Log errors
 */
Bar.prototype.log = function() {
  console.log.apply(console, arguments);
};
