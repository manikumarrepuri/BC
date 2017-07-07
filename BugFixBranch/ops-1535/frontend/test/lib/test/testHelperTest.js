
"use strict";

let appRootPath = require("app-root-path");
let TestHelper  = require(appRootPath + "/lib/test/testHelper");
let BaseError   = require(appRootPath + "/lib/error/baseError");
let assert      = require("chai").assert;

describe("TestHelper", function() {

  it("should allow to pass valid path to constructor", function () {
    let testHelper = new TestHelper(__filename);
    assert.equal(__filename, testHelper.getTestPath());
  });

  it("should throw error when invalid path was passed to constructor", function () {
    assert.throws(function() {
        new TestHelper(__filename + "/invalid");
      },
      "Invalid test path provided"
    );
  });

  it("should allow to pass valid fixtures' path to constructor", function () {
    let testHelper = new TestHelper(__filename);
    testHelper.setTestFixturesDirPath(__dirname + "/../");
    assert.equal(__dirname + "/../", testHelper.getTestFixturesDirPath());
  });

  it("should throw error when invalid fixtures' path was passed to constructor", function () {
    assert.throws(function() {
        let testHelper = new TestHelper(__filename);
        testHelper.setTestFixturesDirPath(__dirname + "/../invalid");
      },
      "Invalid test's fixtures path provided"
    );
  });

  it("should allow to pass valid dataProvider's path to constructor", function () {
    let testHelper = new TestHelper(__filename);
    testHelper.setTestDataProvidersDirPath(__dirname + "/../");
    assert.equal(__dirname + "/../", testHelper.getTestDataProvidersDirPath());
  });

  it("should throw error when invalid dataProvider' path was passed to constructor", function () {
    assert.throws(function() {
        let testHelper = new TestHelper(__filename);
        testHelper.setTestDataProvidersDirPath(__dirname + "/../invalid");
      },
      "Invalid test's data provider directory path provided"
    );
  });

  it("should allow to retrieve default fixtures path", function () {
    let testHelper = new TestHelper(__filename);
    let fixturesPath = testHelper.getTestFixturesDirPath();
    let tmp = __filename;
    tmp = tmp.substr(0, tmp.indexOf("/test/"));
    assert.equal(fixturesPath, tmp + "/test/fixtures/lib/test/testHelperTest/");
  });

});

// // is it possible to get default fixtures path
// module.exports.testGetDefaultTestFixturesDirPath = function (test) {
//   var helper = new Helper(__filename);
//   var fixturesPath = helper.getTestFixturesDirPath();
//   var tmp = __filename;
//   tmp = tmp.substr(0, tmp.indexOf("/test/"));
//   test.equal(fixturesPath, tmp + "/test/fixtures/lib/test/helper/");
//   test.done();
// }
