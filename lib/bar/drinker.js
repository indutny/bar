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
  vm.runInNewContext(content, bar.utils.saturate({
    /**
     * Tunnel drinker's require to global
     */
    require: function() {
      return require.apply(null, arguments);
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
     * Wait for drinker to enter bar
     */
    waitFor: function(name, callback) {
      _bar.waitFor(name, callback);
    },

    /**
     * Hook & snap
     */
    hook: function(event, callback) {
      that.pint.emit(event, callback);
      that.pint.on(event, function(event, fn) {
        callback(fn);
      });
    },

    snap: function(event, fn) {
      that.pint.emit(event, fn);
      that.pint.on(event, function(event, callback) {
        callback(fn);
      });
    },

    /**
     * Wrap _bar.log
     */
    log: function() {
      _bar.log.apply(_bar, arguments);
    }
  }, this.pint), file);

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
};
drinker.Drinker = Drinker;

/**
 * Constructor wrapper
 */
function create(file, content, options) {
  return new Drinker(file, content, options);
};
drinker.create = create;
