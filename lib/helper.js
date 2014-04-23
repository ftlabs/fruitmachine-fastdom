/* jshint node:true */

/**
 * FastDom Helper
 *
 * Bakes FastDom API into modules and ensures outstanding jobs are cleaned up
 * when the module is destroyed.
 *
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All rights reserved]
 */

'use strict';

/**
 * Module Dependencies
 */

var Fastdom = require('instantiable-fastdom');
var bind = require("lodash.bind");


module.exports = function(view) {
  var fd = view.fastdom = new Fastdom();

  view.read  = bind(fd.read,  fd);
  view.write = bind(fd.write, fd);
  view.defer = bind(fd.defer, fd);

  view.on('teardown', function() {
    fd.clear();
  });
};

