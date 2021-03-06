/* jshint node:true */

/**
 * FastDom Helper
 *
 * Bakes FastDom API into modules
 * and ensures outstanding jobs
 * are cleaned up when the
 * module is destroyed.
 *
 * @author  Wilson
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All rights reserved]
 */

'use strict';

// Do nothing if DOM is not available
if ('object' !== typeof window) {
  module.exports = function(){}
} else {
  /**
   * Module Dependencies
   */

  var fastdom = require('fastdom');

  /**
   * Exports
   */

  module.exports = function(view) {

    // Protect against the helper being attached to the view multiple times
    if (view.defer) return;

    var jobs = {
      read: [],
      write: [],
      defer: []
    };

    /**
     * Wraps the fastdom.read
     * API.
     *
     * Keeps track of the job
     * and then removes the
     * refernece when the job
     * is run.
     *
     * @param  {Function} fn
     * @param  {Object}   ctx
     * @api public
     */
    view.read = function(fn, ctx) {
      var job = fastdom.read(function() {
        remove(job, jobs.read);
        fn.call(ctx);
      });

      jobs.read.push(job);
    };

    /**
     * Wraps the fastdom.write
     * API.
     *
     * Keeps track of the job
     * and then removes the
     * reference when the job
     * is run.
     *
     * @param  {Function} fn
     * @param  {Object}   ctx
     * @api public
     */
    view.write = function(fn, ctx) {
      var job = fastdom.write(function() {
        remove(job, jobs.write);
        fn.call(ctx);
      });

      jobs.write.push(job);
    };

    /**
     * Wraps the fastdom.defer
     * API.
     *
     * Keeps track of the job
     * and then removes the
     * reference when the job
     * is run.
     *
     * @param  {Function} fn
     * @param  {Object}   ctx
     * @api public
     */
    view.defer = function(frames, fn, ctx) {

      // Frames argument is optional
      if (typeof frames === 'function') {
        ctx = fn;
        fn = frames;
        frames = 1;
      }

      var job = fastdom.defer(frames, function() {
        remove(job, jobs.defer);
        fn.call(ctx);
      });

      jobs.defer.push(job);
    };

    function flush() {
      jobs.read.forEach(clear);
      jobs.write.forEach(clear);
      jobs.defer.forEach(clear);
    }

    // Clear all pending jobs so
    // that they don't get run after
    // the view has been torn down
    view.on('teardown', flush);

    // A statechange event is fired
    // from the fruitmachine-media helper
    // to alert other modules that
    // a state has been torn down.
    view.on('statechange', flush);
  };
}


/**
 * Clears a FastDom job.
 *
 * @param  {Number|Function} job
 */
function clear(job) {
  fastdom.clear(job);
}

/**
 * Removes an item
 * from a list.
 *
 * @param  {*} item
 * @param  {Array} list
 */
function remove(item, list) {
  var i = list.indexOf(item);
  if (~i) list.splice(i, 1);
}
