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
  var that = this;

  /**
   * Save file for future
   */
  this.file = file;

  /**
   * Create new pint
   */
  this.pint = new bar.options.EventEmitter();

  /**
   * Attach Drinker to bar
   */
  this.bar = bar;

  /**
   * Run script contents in new context
   */
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

  this.pipeEvents();
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
 * Pipe events: pint => bar.pool and pint <= bar.pool
 */
Drinker.prototype.pipeEvents = function() {
  var that = this,
      bar = this.bar;

  /**
   * Ignore just emitted events
   * to prevent looping
   */
  function ignore() {
    return ignore.flag = !ignore.flag;
  };
  ignore.flag = true;

  /**
   * Emit events caught in ein to eout
   */
  function pipe(ein, eout) {
    function pipe(ev) {
      /**
       * Do not pipe out local events
       */
      if (ev.indexOf('.' + that.name) !== -1) return;
      if (ignore()) return;
      eout.emit.apply(bar.pool, arguments);
    };
    ein.on('leave.' + that.name, function() {
      ein.removeListener('*', pipe);
    });
    ein.on('*', pipe);
  };

  /**
   * Pipe all events from pint to bar.pool
   */
  pipe(this.pint, bar.pool);

  /**
   * Pipe all events from bar.pool to pint
   */
  pipe(bar.pool, this.pint);
};
