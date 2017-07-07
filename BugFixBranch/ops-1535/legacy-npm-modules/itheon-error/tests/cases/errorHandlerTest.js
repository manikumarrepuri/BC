"use strict";

var assert        = require("chai").assert;
var stubs         = require("itheon-test").stubs;
var TestExpress   = require('itheon-test').TestExpress;
var proxyquire    = require('proxyquire');
var BaseError     = stubs.BaseError;
var errorHandler  = proxyquire.noCallThru().load("../../lib/errorHandler.js", {
  "./baseError": stubs.BaseError,
  "itheon-logger": stubs.logger,
  "itheon-utility": {
    '@noCallThru': false
  }
});

var app = TestExpress();
var req = {};

describe("errorHandler", function() {
  describe("Returning JSON errors", function() {
    it("should return error with default statusCode 500", function() {
      let res = app.makeResponse(function(err, sideEffects) {
        let expectedDetails = {
          body: '"Invalid whatyamacallit"',
          headers: {
            'Content-Type': 'application/json',
            statusCode: 500
          }
        };

        assert.deepEqual(
          sideEffects,
          expectedDetails
        );
      });

      errorHandler.resolve(new BaseError('Invalid whatyamacallit'), req, res);
    });

    it("should return error with overriden statusCode 400", function() {
      let res = app.makeResponse(function(err, sideEffects) {
        let expectedDetails = {
          body: '{"type":"BaseError","message":"Invalid whatyamacallit","errorCode":123,"data":null}',
          headers: {
            'Content-Type': 'application/json',
            statusCode: 400
          }
        };

        assert.deepEqual(
          sideEffects,
          expectedDetails
        );
      });

      errorHandler.resolve(new BaseError('Invalid whatyamacallit', null, 123), req, res);
    });

    it("should return error with requested statusCode 404", function() {
      let res = app.makeResponse(function(err, sideEffects) {
        let expectedDetails = {
          body: '{"type":"BaseError","message":"Invalid whatyamacallit","errorCode":404,"data":null}',
          headers: {
            'Content-Type': 'application/json',
            statusCode: 404
          }
        };

        assert.deepEqual(
          sideEffects,
          expectedDetails
        );
      });

      errorHandler.resolve(new BaseError('Invalid whatyamacallit', null, 404), req, res);
    });

    it("should not throw error when sent dodgy data", function() {
      assert.doesNotThrow(
        function() {
          errorHandler.resolve('Invalid whatyamacallit')
        },
        Error
      );
    });
  });
});
