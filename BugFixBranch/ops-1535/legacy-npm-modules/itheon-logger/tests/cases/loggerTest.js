"use strict"; //  Use ECHMA6

var assert = require("assert");
// Require the Logger class
var Logger = require("../../lib/logger").Logger;
var config = require("itheon-config").ConfigFactory.getConfig();
var _      = require("underscore");
var sinon  = require("sinon");
// Chai
var chai        = require("chai");
var chaiAssert  = chai.assert;

var expectedLevels = {error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

describe("Logger Test", () => {
  var logger;

  beforeEach(()=>{
    logger = new Logger();
  });

  describe("Constructor tests", () => {


    it("Should confirm the levels attribute is as expected", () => {
        assert.deepEqual(expectedLevels, logger.levels,
          "The levels attribute is not as expected");
    });

    it("Should confirm crucial attributes are available", () => {
      assert(_.isObject(logger), "logger is not an object");
      assert.notEqual(logger.maxLevel, undefined, "maxLevel is undefined");
      assert(_.isObject(logger.logger), "logger.logger is not an object");

    });

    it("Should confirm the right logging level has been returned", () => {
      /*
      * Test to assert if the "console.level" matches the values defined in the
      * "expectedLevels" variable.
      *
      *"logger.logger.transports.console.level" is the logging level passed in
      * from the "app.json" file. "logger.maxLevel" is set in the "logger.js"
      * file.
      */
      assert.deepEqual(logger.logger.transports.console.level,
        Object.keys(expectedLevels)[logger.maxLevel],
        "The logging level is not what was expected")

    });

  });

  describe("Should return the correct log results", () => {
    var logStub
    var logSpy

    beforeEach(() => {
      logStub = sinon.stub(logger.logger, "log");
      logSpy = sinon.spy(logger, "_log");
    })

    it("Should return false when level is bigger than maxLevel", sinon.test( function() {
      // Set the maxLevel of logs allowed to 1 ("warn")
      logger.maxLevel = 1;
      // log a "silly" (5) event
      logger.silly("Silly Message", "Silly Message");
      /*
      * Assert that the "_log" function returns false as the maxLevel (1)
      * is less than the passed in log (5 - "silly")
      */
      assert.deepEqual(logSpy.returnValues[0], false,
        "function did not return False when it should have");
    }));

    it("Should return Error when passed into message parameter", sinon.test(function () {
      var error = "Test Error! to be captured";
      /* Pass an error (message parameter) into the logger */
      try {
        throw new Error(error);
      } catch (err) {
        logger.error(err, "warning");
      }
      /* Assert that the logger returns  the error passed into it above*/
      chaiAssert.include(logStub.getCall(0).args[1],
        "Message: " + error);
    }));

    it("Should return Error when passed into data parameter", sinon.test(function () {
      var error = "Test Error! to be captured";
      /* Pass an error (data parameter) into the logger */
      try {
        throw new Error(error);
      } catch (err) {
        logger.error("Warning", err);
      }
      /* Assert that the logger returns  the error passed into it above */
      chaiAssert.include(logStub.getCall(0).args[1],
        "Error: " + error);
    }));

  });

  describe("Level tests", () => {
    var logStub
    var logSpy

    beforeEach(() => {
      logStub = sinon.stub(logger.logger, "log");
      logSpy = sinon.spy(logger, "_log");
    })

    // Loop through each entry in the 'expectedLevels' variable object ('error', 'warn' etc)
    for (var level in expectedLevels) {
      // Create an anonymous function and pass in the 'level' parameter
      (function (level) {
        // Create a test case for every level parameter
        it("Should not log messages lower than the maxLevel of " + level, function(done) {
          // Set the 'maxLevel' to the current level (0, 1 etc)
          logger.maxLevel = expectedLevels[level];
          // Loop through each entry in the 'expectedLevels' variable object ('error', 'warn' etc) again
          for (var testLevel in expectedLevels) {
            // If the 'maxLevel' is less than the current level (0, 1 etc)
            if (logger.maxLevel < expectedLevels[testLevel]) {
              var index = 0
              // log a new message with the current level (logger.error, logger.warn etc)
              logger[testLevel](testLevel, "This is " + testLevel);
              // Assert that the method returns 'false'
              assert.deepEqual(logSpy.returnValues[0], false,
                "function did not return false when a " + testLevel + " log was sent, with a maxLevel of " + logger.maxLevel);
              // Increment the index variable
              index ++
            }
          }
          // Call done on the test case
          done();
        });
      })(level);// Executes the anonymous function straight away ('iffe')
    }



  });

});
