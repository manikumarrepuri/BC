
"use strict"

var appRoot = require('app-root-path');
var _       = require('underscore');

var DeviceService = require(appRoot + '/lib/module/device/service/device');

var redis        = require(appRoot + '/lib/cache/redis');
var memoryMapper = require(appRoot + '/lib/mapper/memory');

var TestHelper = require(appRoot + '/lib/test/helper');
var testHelper = new TestHelper(__filename);

var devicesDataProvider = testHelper.getDataProvider('devices');

exports.setUp = function(done) {
  testHelper.executeFixtureScript('sampleDevicesAndRules', function() {
    done()
  });
}

exports.testGetDevicesWithRulesFromDb = function(test) {

  var deviceService = new DeviceService();
  deviceService.use('db');

  deviceService.getDevicesWithRules()
    .then(function (devices) {
      var server1 = _.extend({}, devicesDataProvider.expectedDevices[0]);
      var server2 = _.extend({}, devicesDataProvider.expectedDevices[1]);
      var server3 = _.extend({}, devicesDataProvider.expectedDevices[2]);
      delete server1.hash;
      delete server2.hash;
      delete server3.hash;
      test.deepEqual(server1, devices[0]);
      test.deepEqual(server2, devices[1]);
      test.deepEqual(server3, devices[2]);
      test.done();
  });
};

exports.testStoreDevicesInCache = function(test) {

  var deviceService = new DeviceService();
  deviceService.use('cache');

  deviceService.save(devicesDataProvider.expectedDevices)
    .then(function() {

      return redis.mget([
        'device:Bluechip:Generic',
        'device:Bluechip:Itheon:Bedford:Franklin_Court:Server1',
        'device:Bluechip:Itheon:Bedford:Franklin_Court:Server2'
      ]);

    }).then(function(devices) {

      var server1 = JSON.parse(devices[0]);
      var server2 = JSON.parse(devices[1]);
      var server3 = JSON.parse(devices[2]);

      test.deepEqual(devicesDataProvider.expectedDevices[0], server1);
      test.deepEqual(devicesDataProvider.expectedDevices[1], server2);
      test.deepEqual(devicesDataProvider.expectedDevices[2], server3);

      test.done();
    });
};

exports.testStoreDevicesInMemory = function(test) {

  var deviceService = new DeviceService();
  deviceService.use('memory');

  var devices = [
    {
      displayName: 'some-dev-server-1',
      id: '70c4c193-2a4b-4972-b508-94b2b7c65958',
      location: 'Bluechip:Itheon:Bedford:Franklin_Court',
      name: 'Server1',
      platform: 'windows',
      rules: []
    },
    {
      displayName: 'some-dev-server-2',
      id: '64b353f1-55f3-4017-aa4d-166dd17e2dec',
      location: 'Bluechip:Itheon:Bedford:Franklin_Court',
      name: 'Server2',
      platform: 'windows',
      rules: []
    }
  ];

  deviceService.save(devices);

  memoryMapper.get(
    'devices',
    'device:Bluechip:Itheon:Bedford:Franklin_Court:Server1'
  ).then(function(result) {

    test.deepEqual(devices[0], result);

    return memoryMapper.get(
      'devices',
      'device:Bluechip:Itheon:Bedford:Franklin_Court:Server2'
    );
  }).then(function(result) {
    test.deepEqual(devices[1], result);
    test.done();
  });
};