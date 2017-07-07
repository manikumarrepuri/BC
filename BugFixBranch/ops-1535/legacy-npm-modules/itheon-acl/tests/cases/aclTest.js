
"use strict";

let appRootPath = require("app-root-path");
let assert      = require("chai").assert;
let _           = require("itheon-utility").underscore;
let TestHelper  = require("itheon-test").helper;

let testHelper  = new TestHelper(__filename);

describe("ACL", function() {

  before(function (done) {
    testHelper.executeFixtureScript("sampleAclRulesAndUsers", done);
  });

  describe("isAllowed method (single role)", function () {
    it("should return valid resolution", function (done) {
      var aclService = require(appRootPath + "/lib/acl");
      aclService.isAllowed("admin", "otherPage", "view").then(function(result) {

        assert.isOk(
          result,
          "User admin is allowed to 'view' 'otherPage' resource"
        );

        return aclService.isAllowed("admin", "devicesPage", "view");

      }).then(function(result) {

        assert.isNotOk(
          result,
          "User admin is NOT allowed to 'view' 'devicesPage' resource"
        );

        done();

      });
    });
  });

  describe("isAllowed method (multiple roles)", function () {
    it("should return valid resolution", function (done) {
      var aclService = require(appRootPath + "/lib/acl");
      aclService.isAllowed("joed", "devicesPage", "view").then(function(result) {

        assert.isOk(
          result,
          "User joed is allowed to 'view' 'devicesPage' resource"
        );

        return aclService.isAllowed("joed", "otherPage2", "view");

      }).then(function(result) {

        assert.isNotOk(
          result,
          "User admin is NOT allowed to 'view' 'otherPage2' resource"
        );

        done();

      });
    });
  });

  describe("Trying to run isAllowed on non-existing user", function () {
    it("should return false", function (done) {
      var aclService = require(appRootPath + "/lib/acl");

      aclService.isAllowed("non-existing", "devicesPage", "view").then(function(result) {

        assert.isNotOk(
          result,
          "Non-existing user always return false"
        );

        done();

      });
    });
  });

  describe("Trying to run isAllowed on non-existing resource", function () {
    it("should return false", function (done) {
      var aclService = require(appRootPath + "/lib/acl");

      aclService.isAllowed("admin", "non-existing", "view").then(function(result) {

        assert.isNotOk(
          result,
          "Non-existing resource always return false"
        );

        done();

      });
    });
  });

  describe("Trying to run isAllowed on non-existing action", function () {
    it("should return false", function (done) {
      var aclService = require(appRootPath + "/lib/acl");

      aclService.isAllowed("admin", "otherPage", "non-existing").then(function(result) {

        assert.isNotOk(
          result,
          "Non-existing action always return false"
        );

        done();

      });
    });
  });

});
