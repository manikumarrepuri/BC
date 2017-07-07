
"use strict";

let appRootPath  = require("app-root-path");
let RequestError = require(appRootPath + "/lib/request/requestError");
let assert       = require("chai").assert;

describe("RequestError", function() {

  describe("exporting details", function () {

    it("should return expected object", function () {

      let requestError = new RequestError(
        "Test request exception message",
        {
          test: false,
          test2: true,
          abc: "def"
        },
        4
      );

      let expectedDetails = {
        type: "RequestError",
        message: "Test request exception message",
        errorCode: 4,
        data: {
          test: false,
          test2: true,
          abc: "def"
        }
      };

      assert.deepEqual(
        requestError.exportDetails(),
        expectedDetails
      );

    });

  });

});
