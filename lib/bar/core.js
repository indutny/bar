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
    EventEmitter: require('../../vendor/EventEmitter2').EventEmitter2,
    log: null,
    nolog: false,
    autoreload: true
  }, options);

  /**
   * Override default logger if it was provided in options
   */
  if (options.log) {
    this.log = log;
  };

  /**
   * Turn off logging if nolog == true
   */
  if (options.nolog) {
    this.log = function() {};
  };

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
      if (curr === null) {
        that.enter(Object.keys(f));
      } else {
        if (options.autoreload) {
          that.enter([f]);
        }
      }
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
    /**
     * Bouncer won't allow any non .js drinkers
     * to go into a bar
     */
    if (!/\.js$/.test(file)) return;

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
         * (Of course if drinker is still drunk
         *  we can leave him)
         */
        if (!that.leave(file, content)) {
          return;
        }

        var drinker = bar.drinker.create(file, content, that);
        that.drinkers[drinker.name] = that.drinkers[file] = drinker;

        that.log(' > %s goes into a bar', drinker.name);
      });
    });
  });
};

/**
 * Remove file
 */
Bar.prototype.leave = function(drinker, content) {
  if (this.drinkers[drinker]) {
    /**
     * If content was provided - kick drinker only if
     * hash was changed
     */
    if (content) {
      var hash = bar.utils.sha1(content);
      if (hash === this.drinkers[drinker].hash) return false;
    }

    var name = this.drinkers[drinker].name;
    this.pool.emit('leave.' + name);

    this.log(' < %s leaves bar', name);

    /**
     * Remove drinkers by name and filename from hashmap
     */
    this.drinkers[drinker] = this.drinkers[name] = null;
  }
  return true;
};

/**
 * Log errors
 */
Bar.prototype.log = function() {
  console.log.apply(console, arguments);
};
