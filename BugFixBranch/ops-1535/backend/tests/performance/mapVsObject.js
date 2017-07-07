
"use strict";

var appRootPath = require("app-root-path");
var assert      = require("chai").assert;
var _           = require("opserve-common").utilities.underscore;
var logger      = require("opserve-common").logger;

let nativeObject = {
  "random-4e5f08a5": "test",
  "random-64092e14": true,
  "random-d6a26de5": {
    "a": "b",
    "c": "d"
  },
  "random-c19ec008": -1,
  "random-144f3974": 12,
  "random-8b45de3e": null
};

let mapObject = new Map();
mapObject.set("random-4e5f08a5", "test");
mapObject.set("random-64092e14", true);
mapObject.set("random-d6a26de5", {
  "a": "b",
  "c": "d"
});
mapObject.set("random-c19ec008", -1);
mapObject.set("random-144f3974", 12);
mapObject.set("random-8b45de3e", null);

describe("MapObject", function() {

  describe("getting specified keys", function () {

    it("should be SLOWER than object", function () {

      this.timeout(5000);

      let expectedResults = {
        random1: {
          "a": "b",
          "c": "d"
        },
        random2: 12,
        random3: true,
        nonExisting: undefined
      };

      let key1 = "random-d6a26de5";
      let key2 = "random-144f3974";
      let key3 = "random-64092e14";
      let nonExisting = "nonExisting";

      let mapStart = new Date().getTime();

      for (var i=0; i < 100000; i++) {
        let random1 = mapObject.get(key1);
        let random2 = mapObject.get(key2);
        let random3 = mapObject.get(key3);
        let nonExistingValue = mapObject.get(nonExisting);

        let currentResults = {
          random1: random1,
          random2: random2,
          random3: random3,
          nonExisting: nonExistingValue
        };

        assert.deepEqual(expectedResults, currentResults, "Map returns expected values");
      }

      let mapTime = new Date().getTime() - mapStart;

      // ---------- NATIVE OBJECT ----------

      let nativeStart = new Date().getTime();

      for (var j=0; j < 100000; j++) {
        let random1 = nativeObject[key1];
        let random2 = nativeObject[key2];
        let random3 = nativeObject[key3];
        let nonExistingValue = nativeObject[nonExisting];

        let currentResults = {
          random1: random1,
          random2: random2,
          random3: random3,
          nonExisting: nonExistingValue
        };

        assert.deepEqual(expectedResults, currentResults, "Native object returns expected values");
      }

      let nativeTime = new Date().getTime() - nativeStart;

      assert.ok(
        nativeTime < mapTime,
        "native object getting values time(" + nativeTime + ") is smaller than Map time(" + mapTime + ")"
      );

      logger.info("native object getting values time(" + nativeTime + ") is smaller than Map time(" + mapTime + ")");
    });
  });

  describe("getting keys", function () {

    it("should be SLOWER than object", function () {

      let mapStart = new Date().getTime();

      for (var i=0; i < 100000; i++) {
        let keys = mapObject.keys();
      }

      let mapTime = new Date().getTime() - mapStart;

      // ---------- NATIVE OBJECT ----------

      let nativeStart = new Date().getTime();

      for (var j=0; j < 100000; j++) {
        let keys = _.keys(nativeObject);
      }

      let nativeTime = new Date().getTime() - nativeStart;

      assert.ok(
        nativeTime < mapTime,
        "native object getting keys time(" + nativeTime + ") is smaller than Map time(" + mapTime + ")"
      );

      logger.info("native object getting keys time(" + nativeTime + ") is smaller than Map time(" + mapTime + ")");
    });
  });
});
