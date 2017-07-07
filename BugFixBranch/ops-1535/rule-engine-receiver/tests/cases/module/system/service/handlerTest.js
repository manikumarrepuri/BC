"use strict"

var appRootPath = require('app-root-path');
var assert      = require("chai").assert;
var common      = require('opserve-common');
var _           = common.utilities.underscore;
const config    = common.Config.get();
var sinon       = require("sinon");

//dataProvider
var performanceDataProvider = require(appRootPath + '/tests/dataProviders/lib/module/system/service/handlerTest/metrics');
var eventDataProvider       = require(appRootPath + '/tests/dataProviders/lib/module/system/service/handlerTest/events');

// services
var InitializeService       = require(appRootPath + '/lib/module/system/service/initializeService');
var HandlerService          = require(appRootPath + '/lib/module/system/service/handlerService');
var ReceiverService         = require(appRootPath + '/lib/module/receiver/service/receiverService');

describe("HandlerTest", function () {
  it("Constructor test - valid receiver", () => {
    let receiverService = new ReceiverService("test string");
    let handlerService = new HandlerService(receiverService);
    assert.deepEqual(handlerService.receiverService, receiverService);
    assert.notDeepEqual(handlerService.receiverService, new ReceiverService());
  });

  it("Consctructor test - invalid receiver", () => {
    assert.throws(() => {
      let handlerService = new HandlerService(new Date());
      // Should throw by now.
      handlerService.handleIncomingData(performanceDataProvider.singleUnixDiskMetricString);
    });
  });

  it("handleIncomingData() - valid performance metric", () => {

    let handlerService = new HandlerService();
    let outputEntity = handlerService.handleIncomingData(
      performanceDataProvider.singleMetricString
    );

    let now = new Date();
    let diff = now - outputEntity.createdAt;
    assert(diff < 500, "createdAt Date object differs from now more than the 500ms threshold");
    outputEntity.createdAt = new Date(0);
    assert.deepEqual(outputEntity, performanceDataProvider.singleMetricStringExpected);
  });

  it("handleIncomingData() - valid Type7 metric", () => {

    let handlerService = new HandlerService();
    let outputEntity = handlerService.handleIncomingData(
      performanceDataProvider.singleType7String
    );

    let now = new Date();
    let diff = now - outputEntity.createdAt;
    assert(diff < 500, "createdAt Date object differs from now more than the 500ms threshold");
    outputEntity.createdAt = new Date(0);
    assert.deepEqual(outputEntity, performanceDataProvider.singleType7StringExpected);
  });

  it("handleIncomingData() - valid unix disk performance metric", () => {

    let handlerService = new HandlerService();
    let outputEntity = handlerService.handleIncomingData(
      performanceDataProvider.singleUnixDiskMetricString
    );

    let now = new Date();
    let diff = now - outputEntity.createdAt;
    assert(diff < 500, "createdAt Date object differs from now more than the 500ms threshold");
    outputEntity.createdAt = new Date(0);
    assert.deepEqual(outputEntity, performanceDataProvider.singleUnixDiskMetricExpected);
  });

  it("handleIncomingData() - invalid string that has no receiver", () => {
    let handlerService = new HandlerService();
    assert.throws(() => {
      handlerService.handleIncomingData(
        "garbage string that shouldn't work"
      );
    });
  });

});
