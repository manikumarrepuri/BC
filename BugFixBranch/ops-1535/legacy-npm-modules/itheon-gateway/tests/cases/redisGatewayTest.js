"use strict";

var _ = require("itheon-utility").underscore;

var assert = require("assert");

var RedisUserGateway = require("../mocks/redisUserGateway");
var Q = require('q');


describe("RedisGateway Test", function () {
  var client;
  var redisUserGateway;

  beforeEach(function (done) {
    client = require('redis-js').toPromiseStyle(Q.defer);
    redisUserGateway = new RedisUserGateway(client);
    done();
  });

  afterEach(function () {
    client.flushall();
  });

  describe("Basic CRUD Operations", function () {

    it("should Create (using set())", function (done) {

      var expectedObj = {
        "key": "bla"
      };

      redisUserGateway.set(Object.keys(expectedObj)[0], expectedObj.key).then(function () {
        return client.get(Object.keys(expectedObj)[0]);
      })
      .then(function (value) {
        assert.deepEqual(value, expectedObj.key);
        done();
      })
      .catch(function (error) {
        done(error);
      });
    });

    it("should Retreive (using get())", function (done) {

      client.set("key", "test value")
        .then(function () {
          return redisUserGateway.get("key");
        })
        .then(function (value) {
          assert.deepEqual(value, {
            "key": "test value"
          });
          done();
        })
        .catch(function (error) {
          done(error);
        });
    });

    it("should Update (using set())", function (done) {

      client.set("key", "unmodified").then(function () {
        return redisUserGateway.set("key", "modified");
      })
        .then(function () {
          return client.get("key");
        })
        .then(function (value) {
          assert.equal(value, "modified");
          done();
        })
        .catch(function (error) {
          done(error);
        });
    });

    it("should Delete (using delete())", function (done) {

      var expectedObj = {
        "key": "bla"
      };

      client.set(Object.keys(expectedObj)[0], expectedObj.key).then(function () {
        return client.get(Object.keys(expectedObj)[0]);
      })
        .then(function (value) {
          assert.equal(value, "bla");
          return redisUserGateway.delete("key");
        })
        .then(function (value) {
          assert.equal(value, 1);
          return client.get(Object.keys(expectedObj)[0]);
        })
        .then(function (value) {
          assert.deepEqual(value, null);
          done();
        })
        .catch(function (error) {
          done(error);
        });
    });
  });

  describe("Method tests", function () {
    it("should mget() corrrectly for a given set of keys", function (done) {
      var expectedObj = {
        TestKey1: "One",
        TestKey2: "Two"
      };

      client.set(Object.keys(expectedObj)[0], expectedObj.TestKey1)
        .then(client.set(Object.keys(expectedObj)[1], expectedObj.TestKey2))
        .then(function () {
          return redisUserGateway.mget([Object.keys(expectedObj)[0], Object.keys(expectedObj)[1]]);
        })
        .then(function (value) {
          assert.deepEqual(value, expectedObj);
          done();
        })
        .catch(function (error) {
          done(error);
        });
    });

    it("should return keys correctly for a given set of patterns", function (done) {
      var testData = {
        seedData: {
          "hello": "hello",
          "hallo": "hallo",
          "hillo": "hillo",
          "hllo": "hllo",
          "heeeello": "heeeello",
          "hbllo": "hbllo"
        },
        tests: [{
          pattern: "h?llo",
          result: ['hello', 'hallo', 'hillo', 'hbllo']
        },
          {
            pattern: "h*llo",
            result: [ 'hello', 'hallo', 'hillo', 'hllo', 'heeeello', 'hbllo' ]  
          },
          {
            pattern: "h[ae]llo",
            result: [ 'hello', 'hallo' ]
          },
          {
            pattern: "h[a-b]llo",
            result: [ 'hallo', 'hbllo' ]
          }]
      };

      (function () {
        for (var item in testData.seedData) {
          client.set(item, item);
        }
      })();

      (function () {
        for (var test in testData.tests) {
          redisUserGateway.keys(testData.tests[test].pattern)
          .then(function (value) {
            assert.deepEqual(value, testData.tests[test].result);
          });
        }

        done();
      })();
    });

    it("should hmset() correctly for a given hash and set of key/value pairs", function (done) {
      var testData = ["AHashValue", { "key1": "value1", "key2": "value2" }];

      redisUserGateway.hmset(testData[0], testData[1])
        .then(function () {
          return client.hgetall(testData[0]);
        })
        .then(function (value) {
          assert.deepEqual(value, testData[1]);
          done();
        })
        .catch(function (error) {
          done(error);
        });
    });

    it("should hgetall() data for a given hash value", function (done) { 
      var testData = ["AHashValue", { "key1": "value1", "key2": "value2" }];

      client.hmset(testData[0], testData[1])
        .then(function () {
          return redisUserGateway.hgetall(testData[0]);
        })
        .then(function (value) {
          assert.deepEqual(value, testData[1]);
          done();
        })
        .catch(function (error) {
          done(error);
        });
    });

    it("should hget() a given field for a given hash value", function (done) { 
      var testData = ["AHashValue", { "key1": "value1", "key2": "value2" }];
      
      client.hmset(testData[0], testData[1])
        .then(function () {
          return redisUserGateway.hget(testData[0], _.first(Object.keys(testData[1])));
        })
        .then(function (value) {
          assert.deepEqual(value, testData[1].key1);
          done();
        })
        .catch(function (error) {
          done(error);
        });
    });
  });
});