
"use strict";

var appRootPath  = require("app-root-path");
var GatewayError = require(appRootPath + "/lib/gateway/gatewayError");
var assert       = require("chai").assert;

describe("GatewayError Tests", function() {

  describe("exporting details", function () {

    it("should return expected object", function () {

      var gatewayError = new GatewayError(
        "Test gateway error message",
        {
          tsdsd: false,
          ert: "1q2w",
          abc: "45wer"
        },
        134
      );

      var expectedDetails = {
        type: "GatewayError",
        message: "Test gateway error message",
        errorCode: 134,
        data: {
          tsdsd: false,
          ert: "1q2w",
          abc: "45wer"
        }
      };

      assert.deepEqual(
        gatewayError.exportDetails(),
        expectedDetails
      );

    });

  });

});
