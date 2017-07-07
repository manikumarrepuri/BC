"use strict"

var appRootPath      = require('app-root-path');
var assert           = require("chai").assert;
var AmqpGateway      = require('opserve-common').gateway.AmqpGateway;

// services
var InitializeService = require(appRootPath + '/lib/module/system/service/initializeService');

describe("InitializeTest", function() {
  it("should startup and return a new amqpgateway", function () {

    var initializeService = new InitializeService();
    var amqpMock = new AmqpGateway({ queue: "sendTo" });
    return initializeService.start()
      .then(function (dp) {
        assert.deepEqual(dp, amqpMock);
      });
  });
});
