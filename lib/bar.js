/**
 * Node.js Bar Module
 */

var bar = exports;

// Utils
bar.utils = require('./bar/utils');

// Drinker
bar.drinker = require('./bar/drinker');

// Core
bar.create = require('./bar/core').create;
bar.Bar = require('./bar/core').Bar;
