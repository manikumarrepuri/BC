
"use strict";

var appRootPath = require("app-root-path");
var assert      = require("chai").assert;

describe("ConfigFactory", function() {

  describe("getting config", function () {

    it("should always return the same instance", function () {

      var ConfigFactory = require(appRootPath + "/lib/configFactory");

      ConfigFactory.setBasePath(appRootPath + "/tests/dataProviders");

      var config = ConfigFactory.getConfig();
      config.xyz = "abc";

      var config2 = ConfigFactory.getConfig();

      assert.deepEqual(
        config2.xyz,
        "abc"
      );

      var expectedData = {
        "works": true,
        "second": "string",
        "third": 23,
        "fourth": {
          "bool": false,
          "test": "xyz"
        },
        "list": []
      };

      var actualData = {
        "works": config2.get("works"),
        "second": config2.get("second"),
        "third": config2.get("third"),
        "fourth": config2.get("fourth"),
        "list": config2.get("list")
      };

      assert.deepEqual(
        actualData,
        expectedData
      );
    });

  });

});
