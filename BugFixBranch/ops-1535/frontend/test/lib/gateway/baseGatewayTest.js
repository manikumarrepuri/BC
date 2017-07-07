
"use strict";

var appRoot     = require("app-root-path");
var BaseGateway = require(appRoot + "/lib/gateway/baseGateway");
var assert      = require("chai").assert;

describe("BaseGateway Tests", function() {

  describe("constructor()", function () {

    it("should allow to inject custom data provider", function () {

      var dataProvider = {
        custom: true
      };

      var gateway = new BaseGateway(dataProvider);

      assert.deepEqual(
        gateway.getDataProvider(),
        dataProvider
      );

    });

  });

  describe("setDataProvider() and getDataProvider()", function () {

    it("should allow to set and retrieve data provider", function () {

      var dataProvider = {
        custom: true
      };

      var gateway = new BaseGateway();
      gateway.setDataProvider(dataProvider);

      assert.deepEqual(
        gateway.getDataProvider(),
        dataProvider
      );

    });

  });

});
