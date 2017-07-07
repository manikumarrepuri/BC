
"use strict"

var appRoot   = require('app-root-path');
var redis     = require(appRoot + '/lib/cache/redis');
var rethinkDb = require(appRoot + '/lib/db/rethinkdb');

exports.testCloseRedisConnection = function(test) {
  redis.quit();
  test.done();
}

exports.testCloseRethinkDbPool = function(test) {
  rethinkDb.getPoolMaster().drain();
  test.done();
}
