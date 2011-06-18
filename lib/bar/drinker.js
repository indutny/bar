/**
 * Node.js Bar Module
 *
 * Drinker
 */

var drinker = exports;

var vm = require('vm');

var bar = require('../bar');

/**
 * Drinker @constructor
 */
function Drinker(file, content, _bar) {
  var that = this;

  /**
   * Save file for future
   */
  this.file = file;

  /**
   * Hold array of localListeners
   * remove then when drinker will leave bar
   */
  var localListeners = [];

  /**
   * Override `addListener` and `on`
   * methods to log event listeners
   */
  function addListener(event, listener) {
    localListeners.push({
      event: event,
      listener: listener
    });
    return _bar.pool.addListener(event, listener);
  };
  this.pint = Object.create(_bar.pool, {
    addListener: {
      value: addListener
    },
    on: {
      value: addListener
    }
  });

  /**
   * Attach Drinker to bar
   */
  this.bar = _bar;

  /**
   * Run script contents in new context
   */
  try {
    vm.runInNewContext(content, bar.utils.saturate({
      /**
       * Tunnel drinker's require to global
       */
      require: function() {

        var paths = module.paths,
            result;

        module.paths = require('module')._nodeModulePaths(file);
        result = require.apply(null, arguments);
        module.paths = paths;

        return result;
      },

      /**
       * Introduce drinker to bar
       */
      name: function(name) {
        if (that.name) {
          _bar.log('Can\'t change name drinker: %s', that.name);
          return;
        }
        that.name = name;
      },

      /**
       * Hook & snap
       */
      hook: function(event, callback) {
        that.pint.emit(event, callback);
        that.pint.on(event, function(event) {
          var args = Array.prototype.slice.call(arguments, 1);
          callback.apply(null, args);
        });
      },

      snap: function(event) {
        var args = Array.prototype.slice.call(arguments, 1);

        that.pint.emit.apply(that.pint, arguments);
        that.pint.on(event, function(event, callback) {
          callback.apply(null, args);
        });
      },

      /**
       * Wrap _bar.log
       */
      log: function() {
        _bar.log.apply(_bar, arguments);
      },

      /**
       * Expose process, setTimeout, setInterval, clearTimeout, clearInterval
       */
      process: process,
      setTimeout: setTimeout,
      setInterval: setInterval,
      clearTimeout: clearTimeout,
      clearInterval: clearInterval
    }, this.pint), file);
  } catch (e) {
    var err = e;
  };

  /**
   * Give a unique initial name to drinker
   * if he doesn't have one
   */
  this.name || (this.name = +new Date + ':' + ~~(Math.random() * 1e9));

  this.pint.on('leave.' + this.name, function() {
    localListeners.forEach(function(pair) {
      that.pint.removeListener(pair.event, pair.listener);
    });
  });

  if (err) {
    process.nextTick(function() {
      _bar.log(err.toString());
      _bar.leave(file);
    });
  }

  this.calculateHash(content);
};
drinker.Drinker = Drinker;

/**
 * Constructor wrapper
 */
function create(file, content, options) {
  return new Drinker(file, content, options);
};
drinker.create = create;

/**
 * Calculate hash of content
 */
function calculateHash(content) {
  this.hash = bar.utils.sha1(content);
};
Drinker.prototype.calculateHash = calculateHash;
