/**
 * Node.js Bar Module
 *
 * Drinker
 */

var drinker = exports;

var bar = require('../bar');

/**
 * Drinker @constructor
 */
function Drinker(file, content, bar) {
  this.file = file;
  this.pint = bar.pool;

  var that = this;

  vm.runInNewContext(content, utils.saturate({
    /**
     * Tunnel drinker's require to global
     */
    require: function() {
      require.apply(null, arguments);
    },

    /**
     * Introduce drinker to bar
     */
    name: function(name) {
      if (that.name) {
        bar.log('Can\'t change name drinker: %s', that.name);
        return;
      }
      that.name = name;
    },

    /**
     * Wait for drinker to enter bar
     */
    waitFor: function(name, callback) {
      bar.waitFor(name, callback);
    }
  }, this.pint), file);

  /**
   * Give a unique initial name to drinker
   * if he doesn't have one
   */
  this.name || (this.name = +new Date + ':' + ~~(Math.random() * 1e9));
};
drinker.Drinker = Drinker;

/**
 * Constructor wrapper
 */
function create(file, content, options) {
  return new Drinker(file, content, options);
};
drinker.create = create;
