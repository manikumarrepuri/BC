
"use strict"

var appRoot = require('app-root-path');
var _       = require('underscore');

// services
var InitializeService = require(appRoot + '/lib/module/subscriber/service/initialize');
var HandlerService    = require(appRoot + '/lib/module/subscriber/service/handler');
var ReceiverService   = require(appRoot + '/lib/module/receiver/service/receiver');

// helpers
var redis        = require(appRoot + '/lib/cache/redis');
var memoryMapper = require(appRoot + '/lib/mapper/memory');

// entities
var PerformanceEntity = require(appRoot + '/lib/module/receiver/entity/performance');
var DeviceEntity      = require(appRoot + '/lib/module/device/entity/device');

var TestHelper = require(appRoot + '/lib/test/helper');
var testHelper = new TestHelper(__filename);

var handlerDataProvider = testHelper.getDataProvider('metrics');

exports.setUp = function(done) {
  testHelper.executeFixtureScript('sampleDevicesAndRules', function() {
    done()
  });
}

exports.testHandleNewDevice = function(test) {

  redis.del('initialization_finished');
  redis.del('initialization_started');

  var initializeService = new InitializeService();
  initializeService.start()
    .then(function() {
      var handlerService = new HandlerService();
      return handlerService.handlePerformanceData(
        handlerDataProvider.singleMetricString
      );
    }).then(function(result) {
      console.log('inside test');
    });

  test.done();

};

//exports.testCreateDeviceFromPerformanceRecord = function(test) {
//
//  var performanceData = {
//    name: 'abc',
//    location: 'def',
//    metrics: {
//      abc: {
//        name: 'abc',
//        value: 'xyz'
//      },
//      def: {
//        name: 'def',
//        value: 'qwe'
//      }
//    }
//  };
//
//  var receiverService = new ReceiverService();
//  var performanceEnity = new PerformanceEntity(performanceData);
//
//  var handlerService = new HandlerService();
//  var deviceEntity = handlerService.createDeviceFromPerformanceRecord(
//    performanceEnity
//  );
//
//  test.deepEqual(performanceEnity.export(), deviceEntity.export());
//  test.done();
//};
//
//exports.testStoreDeviceInMemoryAndRetrieve = function(test) {
//
//  var deviceData = {
//    name: 'abc',
//    location: 'def',
//    metrics: {
//      abc: {
//        name: 'abc',
//        value: 'xyz'
//      },
//      def: {
//        name: 'def',
//        value: 'qwe'
//      }
//    }
//  };
//
//  var deviceEnity = new DeviceEntity(deviceData);
//
//  var handlerService = new HandlerService();
//
//  handlerService.saveDeviceInMemory(
//    deviceEnity
//  ).then(function() {
//
//    return memoryMapper.get('devices', 'device:def:abc');
//
//  }).then(function(result) {
//
//    var result = result.export();
//    deviceData.createdAt = result.createdAt;
//
//    test.deepEqual(deviceData, result);
//    test.done();
//
//  });
//};
//
//exports.testResolveDeviceRules = function(test) {
//
//  redis.del('initialization_finished');
//  redis.del('initialization_started');
//
//  var deviceData = {
//    name: 'abc',
//    location: 'def',
//    metrics: {
//      abc: {
//        name: 'abc',
//        value: 'xyz'
//      },
//      def: {
//        name: 'def',
//        value: 'qwe'
//      }
//    }
//  };
//
//  var deviceEntity = new DeviceEntity(deviceData);
//
//  var handlerService    = new HandlerService();
//  var initializeService = new InitializeService();
//
//  initializeService.start()
//    .then(function() {
//
//      return handlerService.resolveDeviceRules(deviceEntity);
//
//    }).then(function(result) {
//
//      result = result.export();
//      var expectedData = _.extend({}, deviceData);
//      expectedData.createdAt = result.createdAt;
//
//      expectedData.rules = [];
//      expectedData.rules.push({
//        "definition": {
//          "$or": [
//            {
//              "cpuBusy": {
//                "$gte": "{cpuMax}"
//              }
//            },
//            {
//              "physicalMemoryUsed": {
//                "$gte": "{memoryMax}"
//              }
//            }
//          ]
//        },
//        "deviceId": "39257813-f84a-4f0b-b13d-d00cfbcb25b2",
//        "eventDetails": {
//          "default": {
//            "briefText": "This box is beginning to die",
//            "fullText": "This box is beginning to die, with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
//          },
//          "severity1": {
//            "briefText": "oh no it's dead!",
//            "fullText": "oh no it's dead! with cpu at: {cpuBusy}% and memory at: {physicalMemoryUsed}%"
//          },
//        },
//        "handleWhen": {
//          "dependencies": ["cpuBusy", "physicalMemoryUsed"]
//        },
//        "id": '86d01b9d-c0ae-4bab-8125-4e7edf1816cb',
//        "name": "global_cpu_or_memory_load",
//        "subscribers": [
//          "itheon7.1_event"
//        ],
//        "thresholds": {
//          "severity1": {
//            "cpuMax": "95",
//            "memoryMax": "95"
//          },
//          "severity2" : {
//            "cpuMax": "85",
//            "memoryMax": "85"
//          }
//        }
//      });
//
//      test.deepEqual(expectedData, result);
//      test.done();
//    });
//};
