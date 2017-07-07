
"use strict";

var appRootPath = require("app-root-path");
var ConfigError = require(appRootPath + "/lib/config/configError");
var assert      = require("chai").assert;

describe("ConfigError Tests", function() {

  describe("exporting details", function () {

    it("should return expected object", function () {

      var configError = new ConfigError(
        "Test config error message",
        {
          tsdsd: false,
          ert: "1q2w",
          abc: "45wer"
        },
        134
      );

      var expectedDetails = {
        type: "ConfigError",
        message: "Test config error message",
        errorCode: 134,
        data: {
          tsdsd: false,
          ert: "1q2w",
          abc: "45wer"
        }
      };

      assert.deepEqual(
        configError.exportDetails(),
        expectedDetails
      );

    });

  });

});
