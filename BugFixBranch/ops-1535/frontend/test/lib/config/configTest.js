
"use strict";

var appRootPath = require("app-root-path");
var config      = require(appRootPath + "/lib/config/config");
var assert      = require("chai").assert;

describe("Config", function() {

  it("should allow to get config's keys", function () {
    let expressPort = config.get("express:port");
    assert.equal(3001, expressPort);
  });

  it("should allow to get current environment", function () {
    let environment = config.getEnvironment();
    assert.equal(process.env.NODE_ENV || "app", environment);
  });

});
