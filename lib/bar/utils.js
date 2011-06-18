/**
 * Node.js Bar Module
 */

var utils = exports;

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
