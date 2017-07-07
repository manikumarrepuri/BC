"use strict";

let appRootPath = require("app-root-path");
let Route       = require(appRootPath + "/lib/route");
let assert      = require("chai").assert;
let _           = require("itheon-utility").underscore;

describe("Route", function() {

  describe("passing tests at the moment", function () {

    it("should pass", function () {

      assert.deepEqual(
        true,
        false
      );

    });
  });
});
