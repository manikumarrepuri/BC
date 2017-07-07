
"use strict";

var appRootPath = require("app-root-path");
var EntityError = require(appRootPath + "/lib/entity/entityError");
var assert      = require("chai").assert;

describe("EntityError", function() {

  describe("exporting details", function () {

    it("should return expected object", function () {

      var entityError = new EntityError(
        "Test entity error message",
        {
          test: false,
          ert: "qwerty",
          abc: "def"
        },
        10
      );

      var expectedDetails = {
        type: "EntityError",
        message: "Test entity error message",
        errorCode: 10,
        data: {
          test: false,
          ert: "qwerty",
          abc: "def"
        }
      };

      assert.deepEqual(
        entityError.exportDetails(),
        expectedDetails
      );

    });

  });

});
