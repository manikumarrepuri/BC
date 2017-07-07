"use strict";
var appRootPath = require('app-root-path');
var assert = require('assert');

var HandlerService = require(appRootPath + '/lib/handlerService');

var testDataMetrics = require(appRootPath + '/tests/dataProviders/lib/module/handler/metrics');

var Q = require('q');

var sinon = require('sinon');
var sinonStubPromise = require('sinon-stub-promise');
// Needed to ensure that sinon stubs can return promises.
sinonStubPromise(sinon);

describe('HandlerServiceTests', () => {
  it('should handle incoming perfomance data', sinon.test(function () {
    let testData = testDataMetrics.singleMetric;
    let handlerService = new HandlerService();

    let getDeviceIfKnown = sinon.stub(handlerService, "getDeviceIfKnown")
      .returnsPromise()
      .resolves(null);

    var device = {
      id: testData.group + ":" + testData.name,
      name: testData.name,
      group: testData.group,
      platform: testData.platform,
      displayName: null
    };

    let saveDeviceInDb = sinon.stub(handlerService, "saveDeviceInDb")
      .returnsPromise()
      .resolves(device);

    let saveDeviceInCache = sinon.stub(handlerService, "saveDeviceInCache")
      .returnsPromise()
      .resolves(device);

    let globalDevice = testDataMetrics.globalDevice;
    let getGlobalDevice = sinon.stub(handlerService, "getGlobalDevice")
      .returnsPromise()
      .resolves(globalDevice);

    let resolveRulesSpy = sinon.spy(handlerService, "resolveDeviceRules");

    handlerService.handlePerformanceData(testDataMetrics.singleMetric)
      .then(() => {
        assert(getDeviceIfKnown.calledOnce, 'getDeviceIfKnown() should be called.');
        assert(saveDeviceInDb.callCount > 0, 'saveDeviceInDb() should be called.');
        assert(saveDeviceInCache.callCount > 0, 'saveDeviceInCache() should be called.');
        assert(getGlobalDevice.calledOnce, 'getGlobalDevice() should be called.');
        assert(resolveRulesSpy.calledOnce, 'resolveRulesSpy() should be called.');
      })
      .catch((err) => {
        throw err;
      });
  }));

  it('should skip events that have no metrics', sinon.test(function () {
    let testData = testDataMetrics.deviceNoMetrics;
    let handlerService = new HandlerService();

    let getDeviceIfKnown = sinon.stub(handlerService, "getDeviceIfKnown")
      .returnsPromise()
      .resolves(null);

    var device = {
      id: testData.group + ":" + testData.name,
      name: testData.name,
      group: testData.group,
      platform: testData.platform,
      displayName: null
    };

    let saveDeviceInDb = sinon.stub(handlerService, "saveDeviceInDb")
      .returnsPromise()
      .resolves(device);

    let saveDeviceInCache = sinon.stub(handlerService, "saveDeviceInCache")
      .returnsPromise()
      .resolves(device);

    let globalDevice = testDataMetrics.globalDevice;
    let getGlobalDevice = sinon.stub(handlerService, "getGlobalDevice")
      .returnsPromise()
      .resolves(globalDevice);

    let resolveRulesSpy = sinon.spy(handlerService, "resolveDeviceRules");

    handlerService.handlePerformanceData(testData)
      .then(() => {
        assert(!getDeviceIfKnown.calledOnce, 'getDeviceIfKnown() should not be called.');
        assert(!saveDeviceInDb.callCount > 0, 'saveDeviceInDb() should not be called.');
        assert(!saveDeviceInCache.callCount > 0, 'saveDeviceInCache() not should be called.');
        assert(!getGlobalDevice.calledOnce, 'getGlobalDevice() should not be called.');
        assert(!resolveRulesSpy.calledOnce, 'resolveRulesSpy() should not be called.');
      })
      .catch((err) => {
        throw err;
      });
  }));
});
