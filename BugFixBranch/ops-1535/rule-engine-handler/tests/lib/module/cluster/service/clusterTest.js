
"use strict"

var appRoot = require('app-root-path');

var ClusterService = require(appRoot + '/lib/module/cluster/service/cluster');

var redis = require(appRoot + '/lib/cache/redis');

var memoryMapper = require(appRoot + '/lib/mapper/memory');
var RedisMapper  = require(appRoot + '/lib/mapper/redis');

//var TestHelper = require(appRoot + '/lib/test/helper');
//var testHelper = new TestHelper(__filename);
//
//var devicesDataProvider = testHelper.getDataProvider('cluster');

exports.testConstructorSetsCacheMapper = function(test) {

  var redisMapper = new RedisMapper();

  var clusterService = new ClusterService();

  clusterService.use('cache');

  test.deepEqual(redisMapper, clusterService.getMapper());

  test.done();
};

exports.testConstructorAllowsToPassCacheMapper = function(test) {

  var clusterService = new ClusterService({
    cache: memoryMapper
  });

  clusterService.use('cache');

  test.deepEqual(memoryMapper, clusterService.getMapper());

  test.done();
};

exports.testGetInitializationFlagsBothUnset = function(test) {

  var clusterService = new ClusterService();
  clusterService.use('cache');

  redis.del('initialization_finished');
  redis.del('initialization_started');

  clusterService.getInitializationFlags()
    .then(function(results) {

      var expected = {
        initialization_finished: null,
        initialization_started: null
      };

      test.deepEqual(expected, results);
      test.done();
    });
};

exports.testGetInitializationFlagsStartedOnly = function(test) {

  var clusterService = new ClusterService();
  clusterService.use('cache');

  redis.del('initialization_finished');
  redis.del('initialization_started');

  var randomValue = Math.random().toString(36).substr(2);

  redis.set('initialization_started', randomValue)
    .then(function() {
    return clusterService.getInitializationFlags();
  }).then(function(results) {
    var expected = {
      initialization_finished: null,
      initialization_started: randomValue
    };

    test.deepEqual(expected, results);
    test.done();
  });
};

exports.testGetInitializationFlagsFinishedOnly = function(test) {

  var clusterService = new ClusterService();
  clusterService.use('cache');

  redis.del('initialization_finished');
  redis.del('initialization_started');

  var randomValue = Math.random().toString(36).substr(2);

  redis.set('initialization_finished', randomValue)
    .then(function() {
    return clusterService.getInitializationFlags();
  }).then(function(results) {
    var expected = {
      initialization_finished: randomValue,
      initialization_started: null
    };

    test.deepEqual(expected, results);
    test.done();
  });
};

exports.testGetInitializationFlagsFromCacheBothWithValues = function(test) {

  var clusterService = new ClusterService();
  clusterService.use('cache');

  redis.del('initialization_finished');
  redis.del('initialization_started');

  var randomValue1 = Math.random().toString(36).substr(2);
  var randomValue2 = Math.random().toString(36).substr(2);

  redis.set('initialization_finished', randomValue1)
    .then(function() {
      return redis.set('initialization_started', randomValue2)
  }).then(function() {
    return clusterService.getInitializationFlags();
  }).then(function(results) {
    var expected = {
      initialization_finished: randomValue1,
      initialization_started: randomValue2
    };

    test.deepEqual(expected, results);
    test.done();
  });
};

exports.testGetClusterInitializationState = function(test) {

  var clusterService = new ClusterService();
  clusterService.use('cache');

  var combinations = [
    [
      {
        initialization_finished: null,
        initialization_started: null
      },
      'not started'
    ],
    [
      {
        initialization_finished: null,
        initialization_started: new Date().getTime() - 10 * 1000 // 10 secs
      },
      'running'
    ],
    [
      {
        initialization_finished: false,
        initialization_started: new Date().getTime() - 10 * 1000 // 10 secs
      },
      'running'
    ],
    [
      {
        initialization_finished: false,
        initialization_started: new Date().getTime() - 70 * 1000 // 70 secs
      },
      'not started'
    ],
    [
      {
        initialization_finished: true,
        initialization_started: new Date().getTime()
      },
      'finished'
    ],
    [
      {
        initialization_finished: true,
        initialization_started: new Date().getTime() - 70 * 1000 // 70 secs
      },
      'finished'
    ]
  ];

  for (var index in combinations) {
    var singleCase = combinations[index];

    var expectedResult = singleCase.pop();
    var initializationFlags = singleCase.pop();

    test.equals(
      expectedResult,
      clusterService.getClusterInitializationState(initializationFlags)
    );
  }
  test.done();
};

exports.testSetInitializationStartFlag = function(test) {

  var clusterService = new ClusterService();
  clusterService.use('cache');

  redis.del('initialization_finished');
  redis.del('initialization_started');

  clusterService.setInitializationStartFlag()
    .then(function () {
    return clusterService.getInitializationFlags();
  }).then(function(results) {
    test.equals(
      'running',
      clusterService.getClusterInitializationState(results)
    );
    test.done();
  });
};