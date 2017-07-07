
"use strict";

let appRootPath = require("app-root-path");
let BaseError   = require(appRootPath + "/lib/error/baseError");
let assert      = require("chai").assert;

describe("BaseError", function() {

  describe("exporting details", function () {

    it("should return expected object", function () {

      let baseError = new BaseError(
        "Test exception message",
        {
          test: false,
          test2: true
        },
        2
      );

      let expectedDetails = {
        "type": "BaseError",
        "message": "Test exception message",
        "errorCode": 2,
        "data": {
          test: false,
          test2: true
        }
      };

      assert.deepEqual(
        baseError.exportDetails(),
        expectedDetails
      );

    });

  });

});
