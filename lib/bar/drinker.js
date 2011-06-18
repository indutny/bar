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
function Drinker(file, content, options) {
  this.file = file;
};
drinker.Drinker = Drinker;

/**
 * Constructor wrapper
 */
function create(file, content, options) {
  return new Drinker(file, content, options);
};
drinker.create = create;
