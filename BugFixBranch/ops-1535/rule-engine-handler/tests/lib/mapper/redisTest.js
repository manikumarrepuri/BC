
"use strict"

var appRoot = require('app-root-path');

var RedisMapper = require(appRoot + '/lib/mapper/redis');
var Mapper      = require(appRoot + '/lib/mapper');

exports.testExtendsBaseMapper = function(test) {
  test.ok(new RedisMapper instanceof Mapper);
  test.done();
};

exports.testSetGetAndDeleteKeyValuePair = function(test) {

  var randomKey   = Math.random().toString(36).substr(2);
  var randomValue = Math.random().toString(36).substr(2);

  var redisMapper = new RedisMapper();
  redisMapper.set(randomKey, randomValue)
    .then(function() {
      return redisMapper.get(randomKey);
    }).then(function(value){

    test.equals(value, randomValue, 'Retrieving saved value from redis is possible');

    redisMapper.delete(randomKey);

    return redisMapper.get(randomKey);

  }).then(function(valueAfterDelete){

    test.equals(valueAfterDelete, null, 'Retrieving deleted key brings null back');
    test.done();

  });
};
