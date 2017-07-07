
"use strict"

var appRoot = require('app-root-path');

var InitializeService = require(appRoot + '/lib/module/subscriber/service/initialize');
var redis = require(appRoot + '/lib/cache/redis');
var memoryMapper = require(appRoot + '/lib/mapper/memory');

var TestHelper = require(appRoot + '/lib/test/helper');
var testHelper = new TestHelper(__filename);

var devicesDataProvider = testHelper.getDataProvider('devices');

exports.setUp = function(done) {
  testHelper.executeFixtureScript('sampleDevicesAndRules', function() {
    done()
  });
}

exports.testStartInitlizationOfFirstRuleEngine = function(test) {

  var initializeService = new InitializeService();

  redis.del('initialization_finished');
  redis.del('initialization_started');

  memoryMapper.delete('devices', 'device:Bluechip:Itheon:Bedford:Franklin_Court:Server1');
  memoryMapper.delete('devices', 'device:Bluechip:Itheon:Bedford:Franklin_Court:Server2');

  initializeService.start()

    // check Redis flags

    .then(function() {
      return redis.mget(['initialization_finished', 'initialization_started']);
    }).then(function(results){

      var initializationStarted  = results.pop();
      var initializationFinished = results.pop();

      test.equals('true', initializationFinished);

      test.equals(
        true,
        ((new Date) - new Date(initializationStarted * 1000)) < (5 * 60 * 1000),
        'Initialization started less than 5 seconds ago'
      );

    // check Redis keys

    }).then(function() {

      return redis.mget([
        'device:Bluechip:Generic',
        'device:Bluechip:Itheon:Bedford:Franklin_Court:Server1',
        'device:Bluechip:Itheon:Bedford:Franklin_Court:Server2'
      ]);

    }).then(function(devices) {

      var server1 = JSON.parse(devices[0]);
      server1.createdAt = 'xx';
      devicesDataProvider.expectedDevices[0].createdAt = 'xx';
      devicesDataProvider.expectedDevices[0].hash = server1.hash;

      var server2 = JSON.parse(devices[1]);
      server2.createdAt = 'xx';
      devicesDataProvider.expectedDevices[1].createdAt = 'xx';
      devicesDataProvider.expectedDevices[1].hash = server2.hash;

      var server3 = JSON.parse(devices[2]);
      server3.createdAt = 'xx';
      devicesDataProvider.expectedDevices[2].createdAt = 'xx';
      devicesDataProvider.expectedDevices[2].hash = server3.hash;

      test.deepEqual(devicesDataProvider.expectedDevices[0], server1);
      test.deepEqual(devicesDataProvider.expectedDevices[1], server2);
      test.deepEqual(devicesDataProvider.expectedDevices[2], server3);

    // check Memory
    }).then(function() {

      return memoryMapper.get(
        'devices',
        'device:Bluechip:Generic'
      );

    }).then(function(result) {

      result = result.export();


      var expectedResult = devicesDataProvider.expectedDevices[0];
      expectedResult.createdAt = 'xx';
      result.createdAt = 'xx';
      expectedResult.hash = result.hash;

      test.deepEqual(expectedResult, result);

      return memoryMapper.get(
        'devices',
        'device:Bluechip:Itheon:Bedford:Franklin_Court:Server1'
      );

    }).then(function(result) {

      result = result.export();

      var expectedResult = devicesDataProvider.expectedDevices[1];
      expectedResult.createdAt = 'xx';
      result.createdAt = 'xx';
      expectedResult.hash = result.hash;

      test.deepEqual(expectedResult, result);

      return memoryMapper.get(
        'devices',
        'device:Bluechip:Itheon:Bedford:Franklin_Court:Server2'
      );
    }).then(function(result) {

      result = result.export();

      var expectedResult = devicesDataProvider.expectedDevices[2];
      expectedResult.createdAt = 'xx';
      result.createdAt = 'xx';
      expectedResult.hash = result.hash;

      test.deepEqual(expectedResult, result);
      test.done();
    });
};

exports.testStartInitlizationOnAlreadyInitializedCluster = function(test) {

  var initializeService = new InitializeService();

  redis.del('initialization_finished');
  redis.del('initialization_started');

  memoryMapper.delete('devices', 'device:Bluechip:Generic');
  memoryMapper.delete('devices', 'device:Bluechip:Itheon:Bedford:Franklin_Court:Server1');
  memoryMapper.delete('devices', 'device:Bluechip:Itheon:Bedford:Franklin_Court:Server2');

  var extendedServer2 = devicesDataProvider.expectedDevices[1];
  extendedServer2.metrics = {};
  extendedServer2.metrics.cpuBusy = {"value": 84, "type":"%", "timestamp": "123456789"};
  var extendedServer3 = devicesDataProvider.expectedDevices[2];
  extendedServer3.metrics = {};
  extendedServer3.metrics.cpuBusy = {"value": 75, "type":"%", "timestamp": "123456789"};

  memoryMapper.get('devices', 'device:Bluechip:Generic')
    .then(function(result) {
      test.equals(null, result);
      return memoryMapper.get('devices', 'device:Bluechip:Itheon:Bedford:Franklin_Court:Server1');
    }).then(function(result) {
      test.equals(null, result);
      return memoryMapper.get('devices', 'device:Bluechip:Itheon:Bedford:Franklin_Court:Server2');
    }).then(function(result) {
      test.equals(null, result);
      return redis.set('initialization_finished', true);
    })
    .then(function(){
      return redis.set('device:Bluechip:Generic', JSON.stringify(devicesDataProvider.expectedDevices[0]));
    })
    .then(function(){
      return redis.set('device:Bluechip:Itheon:Bedford:Franklin_Court:Server1', JSON.stringify(extendedServer2));
    })
    .then(function(){
      return redis.set('device:Bluechip:Itheon:Bedford:Franklin_Court:Server2', JSON.stringify(extendedServer3));
    })
    .then(function() {
      return initializeService.start();
    })
    .then(function() {

      return memoryMapper.get('devices', 'device:Bluechip:Generic');

    }).then(function(result) {

      result = result.export();

      var expectedResult = devicesDataProvider.expectedDevices[0];
      expectedResult.createdAt = 'xx';
      result.createdAt = 'xx';
      expectedResult.hash = result.hash;

      test.deepEqual(expectedResult, result);

      return memoryMapper.get('devices', 'device:Bluechip:Itheon:Bedford:Franklin_Court:Server1');

    }).then(function(result) {

      result = result.export();

      var expectedResult = extendedServer2;
      expectedResult.createdAt = 'xx';
      result.createdAt = 'xx';
      expectedResult.hash = result.hash;

      test.deepEqual(expectedResult, result);

      return memoryMapper.get('devices', 'device:Bluechip:Itheon:Bedford:Franklin_Court:Server2');

    }).then(function(result) {

      result = result.export();

      var expectedResult = extendedServer3;
      expectedResult.createdAt = 'xx';
      result.createdAt = 'xx';
      expectedResult.hash = result.hash;

      test.deepEqual(expectedResult, result);
      test.done();
    });
};
