"use strict";

var appRootPath   =   require("app-root-path");
var assert        =   require("assert");
// Require the SubscriberService class
var Subscriber    =   require(appRootPath + "/lib/service/subscriber");
var _             =   require("itheon-utility").underscore;
var sinon         =   require("sinon");
var ServiceError  =   require("itheon-service").ServiceError;
// Chai
var chai        = require("chai");
var chaiAssert  = chai.assert;

describe("Subscriber Service tests", () => {
  var subscriberService;

  beforeEach(() => {
    subscriberService = new Subscriber();
  });

  describe("handleSubscribers tests", () => {
    let subscriberSpy;
    let data = {key: "value"};
    let subscriber;

    beforeEach(() => {
      subscriberSpy = sinon.spy(subscriberService, "handleSubscribers");

      // valid entry taken from '/lib/config/subscribers.js'
      subscriber = {
        "name": "itheon10.xAMQP",
        "type": "amqp",
        "settings": {
          "timeout": 5,
          "payload": "{{originalEvent}}",
          "successTest": "<[s|S]tatus>\s*SUCCESS\s*<\/[s|S]tatus>"
        }
      };
    });

    it("Should throw 'invalid event passed' error when data is not an object", function () {
        // Assert that the function throws an error
      chaiAssert.throws(
          function () {
            // Execute the 'handleSubscribers' function, passing in two string values
            subscriberService.handleSubscribers("something", "Value");
          },
          // Assert that a ServiceError is thrown
          ServiceError,
          // Assert that the Error returned matches the string below
          "Invalid event passed. Object expected"
        );
    });

    it("Should not throw 'invalid event passed' error when data is an object", function () {

        // Assert that the function does not throw an error
      chaiAssert.doesNotThrow(
          function () {
            // Execute the 'handleSubscribers' function, passing in an object and string
            subscriberService.handleSubscribers(data,subscriber);
          },
          // Assert that an Error, matching the below condition, does not get returned.
          /Invalid event passed. Object expected/
        );
    });

    it("Should throw 'invalid request' error when subscriber is not an object", function () {
      chaiAssert.throws(
        function () {
          subscriberService.handleSubscribers(data, "not an object");
        },
        ServiceError,
        "Invalid request"
      );
    });

    it("Should throw 'invalid request' error if subscriber object is not in /config/subscriber.js", function () {
      var testSubscriber = {
        "name": "testName",
        "type": "testType",
        "settings": {
          "timeout": 5,
          "payload": "testPayload",
          "successTest": "testSuccessTest"
        }
      };

      chaiAssert.throws(
        function () {
          subscriberService.handleSubscribers(data, testSubscriber);
        },
        ServiceError,
        "Invalid request"
      );
    });

    it("Should not return an error when a valid subscriber is passed in", function () {
      // Execute the 'handleSubscribers' function, passing in the defined variables
      subscriberService.handleSubscribers(data, subscriber);
      // Assert that the output is the same as the input
      assert.deepEqual(JSON.stringify(subscriberSpy.getCall(0).args[1]),
        JSON.stringify(subscriber), "The output of the 'handleSubscribers' function is not what was expected");
    });

  });

  describe("parse tests", () => {
    var subscriberSpy;

    beforeEach(()=> {
      subscriberSpy = sinon.spy(subscriberService, "parse");
    });

    it("Should output 'payload' string input, with the parameter definitions from 'details'", function() {
      let payload = "<p>This is a test to show that the {{param1}} will display. This will then prove that the test works. {{param2}} {{param3}}</p>";
      let details = {"param1": "first parameter", "param2": "second parameter", "param3": "third parameter"};
      let expectedOutput = "<p>This is a test to show that the first parameter will display. This will then prove that the test works. second parameter third parameter</p>";
      subscriberService.parse(payload, details);
      assert.deepEqual(subscriberSpy.returnValues[0], expectedOutput,
        "The output was not equal to what was expected");
    });

    it("Should output 'payload' object input, with the parameter definitions from 'details'", function() {
      let payload = {
        "one": "<p>This is another {{param1}} test</p>",
        "two": "<p>This is a second {{param1}} test</p>",
        "three": "<p>And finally the last {{param1}} test</p>"
      };
      let details = {"param1": "Unit"};
      let expectedOutput = {
        "one":"<p>This is another Unit test</p>",
        "two":"<p>This is a second Unit test</p>",
        "three":"<p>And finally the last Unit test</p>"
      };
      subscriberService.parse(payload, details);
      assert.deepEqual(subscriberSpy.returnValues[0], expectedOutput,
        "The output was not equal to what was expected");
    });

    it("Should output empty object as 'payload' parameter is a boolean and no 'array' parameter exists", function () {
      let payload = true;
      let details = "details";
      subscriberService.parse(payload, details);
      chaiAssert.isObject(subscriberSpy.returnValues[0],
        "The output was not an empty object");
    });

    it("Should output 'payload' object input when values are booleans", function () {
      let payload = {
        "one": true,
        "two": false,
        "three": false
      };
      let details = "details";
      subscriberService.parse(payload, details);
      assert.deepEqual(subscriberSpy.returnValues[0], payload,
        "The output was not equal to what was expected");
    });

    it("Should output array when the payload object has nested objects", function () {

      let expectedOutput = [{
        "one": {
          "first": 'This is the first in a long line of values'
        },
        "two": {
          "second": 'This is the second and final value'
        },
        "three": {
          "third": 'This is the first in a long line of value again'
        }
      }];

      let payload = {
        "one": {
          "first": "This is the {{param1}} values"
        },
        "two": {
          "second": "This is the {{param2}} value"
        },
        "three": {
          "third": "This is the {{param1}} value again"
        }
      };
      let details = {
        "param1": "first in a long line of",
        "param2": "second and final"
      };
      let array = false;
      subscriberService.parse(payload, details, array);
      assert.deepEqual(subscriberSpy.returnValues, expectedOutput,
        "The returned values did not match what was expected");
    });


  });

  describe("retry tests", () => {
    let logger = require('itheon-logger');
    var subscriberLogSpy;
    var subscriber;
    var details;
    var subscriberHandleSpy;

    beforeEach(() => {
      subscriberLogSpy = sinon.stub(logger, "error");
      subscriberHandleSpy = sinon.spy(subscriberService, "handleSubscribers");
      subscriber = [{
        "name": "itheon10.xAMQP",
        "type": "amqp",
        "settings": {
          "timeout": 5,
          "payload": "{{originalEvent}}",
          "successTest": "<[s|S]tatus>\s*SUCCESS\s*<\/[s|S]tatus>",
          "retry": 1
        }
      }];
      details  = {
        "firstTestKey": "firstTestValue",
        "secondTestKey": "secondTestValue",
        "thirdTestKey": "thirdTestValue"
      };
    });
    afterEach(() => {
      subscriberLogSpy = subscriberLogSpy.restore();
    });

    it("Should generate a 'log error' because 'subscriber' has a 'retry' property but 'details' is not an object", function () {
      details = "notAnObject";
      /*
      Should log 'Details is not an object' because 'subscriber' has a
      'settings' 'retry' property but 'details' is not an object.
      */
      subscriberService.retry("notAnObject", subscriber);

      assert.deepEqual(subscriberLogSpy.getCall(0).args[0], "Details is not an object",
        "Did not log with the expected message");
    });

    it("Should call the 'handleSubscribers' function with the correct parameters", function () {
      let expectedOutput = [
        {
          "firstTestKey": "firstTestValue",
          "secondTestKey": "secondTestValue",
          "thirdTestKey": "thirdTestValue",
          "subscribers": {
            "0": {
              "name": "itheon10.xAMQP",
              "type": "amqp",
              "settings": {
                "timeout": 5,
                "payload": "{{originalEvent}}",
                "successTest": "<[s|S]tatus>s*SUCCESSs*</[s|S]tatus>",
                "retry": 0
              }
            }
          }
        }, {
          "0": {
            "name": "itheon10.xAMQP",
            "type": "amqp",
            "settings": {
              "timeout": 5,
              "payload": "{{originalEvent}}",
              "successTest": "<[s|S]tatus>s*SUCCESSs*</[s|S]tatus>",
              "retry": 0
            }
          }
        }
      ];

      subscriberService.retry(details, subscriber);
      assert.deepEqual(JSON.stringify(subscriberHandleSpy.getCall(0).args),
        JSON.stringify(expectedOutput), "The output did not equal what was expected");
    });


    it("should decrement timeout number", function () {
      subscriber[0].settings.retry++;
      var retryCount = subscriber[0].settings.retry;
      subscriberService.retry(details, subscriber);
      assert.deepEqual(subscriber[0].settings.retry, retryCount-1,
        "The retry count did not decrement by 1, as expected");
    });

  });

});
