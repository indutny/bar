/**
 * Node.js Bar Module
 */

var utils = exports;

var crypto = require('crypto');

/**
 * Merge `a` and `b` into new object `c`
 */
function merge(a, b) {
  var c = {};

  /**
   * Copy all properties of a into c
   */
  if (a) {
    for (var i in a) {
      if (a.hasOwnProperty(i)) {
        c[i] = a[i];
      }
    }
  }

  /**
   * Do same with b, but merge existing properties
   */
  if (b) {
    for (var i in b) {
      if (b.hasOwnProperty(i)) {
        c[i] = typeof b[i] === 'object' &&
               typeof c[i] === 'object' ?
                   merge(c[i], b[i])
                   :
                   b[i];
      }
    }
  }

  return c;
};
utils.merge = merge;

/**
 * Saturate object with binding saturator methods
 */
function saturate(obj, saturator) {
  for (var i in saturator) {
    if (typeof saturator[i] === 'function') {
      obj[i] = saturator[i].bind(saturator);
    }
  };

  return obj;
};
utils.saturate = saturate;

/**
 * Calculate sha1 hash of data
 */
function sha1(data) {
  var hash = crypto.createHash('sha1');

  hash.update(data);

  return hash.digest('base64');
};
utils.sha1 = sha1;
