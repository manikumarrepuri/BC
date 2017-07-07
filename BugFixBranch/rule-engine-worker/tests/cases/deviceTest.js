"use strict";

var appRootPath = require('app-root-path');
var common      = require('opserve-common');
var _           = common.utilities.underscore;
var assert = require('chai').assert;
var DeviceService = require(appRootPath + '/lib/deviceService');

var DeviceEntity = require('itheon-module-device-entity').DeviceEntity;
var PerformanceEntity = require('itheon-module-performance-entity').PerformanceEntity;
var DeviceMongoDbGateway    = require(appRootPath + "/lib/deviceMongoDbGateway.js");

var deviceService = new DeviceService({
  db : "a",
  memory : "b",
  cache : "c"
});
describe('Device Module -> Devices Service', function () {

  describe('mergeMetrics', function () {
    it('should merge device level metrics', function () {

      var deviceEntity = {
        metrics: {
          'level1-1': {
            'name': 'level1-1',
            value: 'abc'
          }
        }
      };

      var performanceEntity = new PerformanceEntity({
        'metrics': {
          'level1-1': {
            'name': 'level1-1',
            value: 'bgf'
          }
        }
      });

      var result = deviceService.mergeMetrics(deviceEntity, performanceEntity)
      var resultData = result;

      var expectedResult = {
        metrics: {
          'level1-1': {
            name: 'level1-1',
            deviceId: 'undefined:undefined',
            value: 'bgf',
            createdAt: resultData.metrics["level1-1"].createdAt
          }
        }
      }

      assert.equal(resultData.metrics["level1-1"].name, expectedResult.metrics["level1-1"].name);
      assert.equal(resultData.metrics["level1-1"].deviceId, expectedResult.metrics["level1-1"].deviceId);
      assert.equal(resultData.metrics["level1-1"].value, expectedResult.metrics["level1-1"].value);
      assert.equal(resultData.metrics["level1-1"].createdAt, expectedResult.metrics["level1-1"].createdAt);
    });

    it('should add metrics for new entity (on entity level)', function () {

      var deviceEntity = {
        metrics: {
          'cpuBusy': {
            'name': 'cpuBusy',
            value: 'abc'
          }
        }
      };

      var performanceEntity = new PerformanceEntity({
        'metrics': {
          'cpuBusy': {
            'name': 'cpuBusy',
            value: 'xxxx'
          },
          'disks': {
            'C': {
              'freeSpace': {
                'name': 'freeSpace',
                value: 'efd'
              }
            }
          }
        }
      });

      var result = deviceService.mergeMetrics(deviceEntity, performanceEntity)
      var resultData = result;

      var expectedResult = {
        metrics: {
          'cpuBusy': {
            'name': 'cpuBusy',
            deviceId: 'undefined:undefined',
            value: 'xxxx',
            createdAt: resultData.metrics["cpuBusy"].createdAt
          },
          'disks': {
            C: {
              freeSpace: {
                name: 'freeSpace',
                value: 'efd',
                createdAt: resultData.metrics["disks"].C.freeSpace.createdAt,
                deviceId: 'undefined:undefined',
                entity:"C",
                entityType: "disks"
              }
            }
          }
        }
      };

      assert.equal(resultData.metrics["cpuBusy"].name, expectedResult.metrics["cpuBusy"].name);
      assert.equal(resultData.metrics["cpuBusy"].deviceId, expectedResult.metrics["cpuBusy"].deviceId);
      assert.equal(resultData.metrics["cpuBusy"].value, expectedResult.metrics["cpuBusy"].value);
      assert.equal(resultData.metrics["disks"]["C"].freeSpace.name, expectedResult.metrics["disks"]["C"].freeSpace.name);
      assert.equal(resultData.metrics["disks"]["C"].freeSpace.value, expectedResult.metrics["disks"]["C"].freeSpace.value);
      assert.equal(resultData.metrics["disks"]["C"].freeSpace.deviceId, expectedResult.metrics["disks"]["C"].freeSpace.deviceId);
      assert.equal(resultData.metrics["disks"]["C"].freeSpace.entityType, expectedResult.metrics["disks"]["C"].freeSpace.entityType);
    });

    it('should merge metrics for new entity (on entity level)', function () {

      var deviceEntity = {
        metrics: {
          'cpuBusy': {
            'name': 'cpuBusy',
            value: 'abc'
          },
          'disks': {
            'C': {
              'freeSpace': {
                'name': 'freeSpace',
                value: 'abc'
              }
            },
            'D': {
              'freeSpace': {
                'name': 'freeSpace',
                value: 'xxx'
              }
            }
          }
        }
      };

      var performanceEntity = new PerformanceEntity({
        'metrics': {
          'cpuBusy': {
            'name': 'cpuBusy',
            value: 'xxxx'
          },
          'disks': {
            'C': {
              'freeSpace': {
                'name': 'freeSpace',
                value: 'efd'
              }
            }
          }
        }
      });

      var result = deviceService.mergeMetrics(deviceEntity, performanceEntity);
      var resultData = result;

      var expectedResult = {
        metrics: {
          'cpuBusy': {
            'name': 'cpuBusy',
            value: 'xxxx',
            createdAt: resultData.metrics.cpuBusy.createdAt,
            deviceId: 'undefined:undefined'
          },
          'disks': {
            C: {
              freeSpace: {
                name: 'freeSpace',
                value: 'efd',
                createdAt: resultData.metrics.disks.C.freeSpace.createdAt,
                deviceId: 'undefined:undefined',
                entity:"C",
                entityType: "disks"
              }
            },
            D: {
              freeSpace: {
                name: 'freeSpace',
                value: 'xxx',
                createdAt: resultData.metrics.disks.D.freeSpace.createdAt
              }
            }
          }
        }
      };

      assert.equal(resultData.metrics["cpuBusy"].name, expectedResult.metrics["cpuBusy"].name);
      assert.equal(resultData.metrics["disks"]["C"].freeSpace.name, expectedResult.metrics["disks"]["C"].freeSpace.name);
      assert.equal(resultData.metrics["disks"]["C"].freeSpace.value, expectedResult.metrics["disks"]["C"].freeSpace.value);
      assert.equal(resultData.metrics["disks"]["C"].freeSpace.deviceId, expectedResult.metrics["disks"]["C"].freeSpace.deviceId);
      assert.equal(resultData.metrics["disks"]["C"].freeSpace.entityType, expectedResult.metrics["disks"]["C"].freeSpace.entityType);
      assert.equal(resultData.metrics["disks"]["C"].freeSpace.entity, expectedResult.metrics["disks"]["C"].freeSpace.entity);
      assert.equal(resultData.metrics["disks"]["D"].freeSpace.name, expectedResult.metrics["disks"]["D"].freeSpace.name);
      assert.equal(resultData.metrics["disks"]["D"].freeSpace.value, expectedResult.metrics["disks"]["D"].freeSpace.value);
    });
  });
});
