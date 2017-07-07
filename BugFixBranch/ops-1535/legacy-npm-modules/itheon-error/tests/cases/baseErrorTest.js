"use strict";

var BaseError = require("../../lib/baseError.js");
var assert = require("chai").assert;

class ExtendedError extends BaseError {

}

describe("BaseError", function() {
  describe("throwing errors", function() {
    it("should throw base error", function() {
      assert.throws(function() {
        throw new BaseError('Test 1')
      }, BaseError, "Test 1");
    });

    it("should throw base error no data attribute should be seen", function() {
      assert.throws(function() {
        throw new BaseError('Test 2', 'with some data')
      }, BaseError, "Test 2");
    });

    it("should throw base error with hidden data and error code", function() {
      assert.throws(function() {
        throw new BaseError('Test 3', 'some data', 404)
      }, BaseError, "Test 3");
    });
  });

  describe("exporting details", function() {
    it("should return expected object", function() {
      let baseError = new BaseError(
        "Test exception message", {
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

    it("should return expected object with a default errorCode", function() {
      let baseError = new BaseError(
        "Test exception message", {
          test: false,
          test2: true
        }
      );
      let expectedDetails = {
        "type": "BaseError",
        "message": "Test exception message",
        "errorCode": 1,
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

describe("ExtendedError", function() {
  describe("throwing errors", function() {
    it("should throw extended error", function() {
      assert.throws(function() {
        throw new ExtendedError('Test 1')
      }, ExtendedError, "Test 1");
    });

    it("should throw extended error no data attribute should be seen", function() {
      assert.throw(function() {
        throw new ExtendedError('Test 2', 'with some data')
      }, ExtendedError, "Test 2");
    });

    it("should throw extended error with hidden data and error code", function() {
      assert.throw(function() {
        throw new ExtendedError('Test 3', 'some data', 404)
      }, ExtendedError, "Test 3");
    });
  });

  describe("exporting details", function() {
    it("should return expected object", function() {
      let extendedError = new ExtendedError(
        "Test exception message", {
          test: false,
          test2: true
        },
        2
      );

      let expectedDetails = {
        "type": "ExtendedError",
        "message": "Test exception message",
        "errorCode": 2,
        "data": {
          test: false,
          test2: true
        }
      };

      assert.deepEqual(
        extendedError.exportDetails(),
        expectedDetails
      );
    });

    it("should return expected object with a default errorCode", function() {
      let extendedError = new ExtendedError(
        "Test exception message", {
          test: false,
          test2: true
        }
      );
      let expectedDetails = {
        "type": "ExtendedError",
        "message": "Test exception message",
        "errorCode": 1,
        "data": {
          test: false,
          test2: true
        }
      };

      assert.deepEqual(
        extendedError.exportDetails(),
        expectedDetails
      );
    });
  });
});
