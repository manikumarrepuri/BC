
"use strict";

var appRoot    = require("app-root-path");
var assert     = require("chai").assert;
var BaseEntity = require(appRoot + "/lib/entity/baseEntity");
var BaseCollectionEntity = require(appRoot + "/lib/entity/BaseCollectionEntity");

BaseCollectionEntity.setBasePath(appRoot + '/test');

class DummyCollectionEntity extends BaseCollectionEntity
{
  constructor(data)
  {
    super('Dummy', 'dummy', data);
  }
}

describe("BaseCollectionEntity", function() {
  describe("on instantiation of base entity", function () {
    it("should inflate a blank collection", function () {
      assert.throw(function() {
        new BaseCollectionEntity();
      }, "BaseCollectionEntity used incorrectly. You need to extend default constructor!");
    });
  });
});


describe("DummyCollectionEntity (extension of BaseCollectionEntity)", function() {

  describe("constructor()", function () {

    it("should inflate valid array of entities", function () {

      var entities = [
        {
          id: "1",
          name: "abc",
          email: "example@example.com",
          age: 23
        },
        {
          id: "2",
          name: "abd",
          email: "example@example.com",
          age: 24
        },
      ]

      var dummyCollectionEntity = new DummyCollectionEntity(entities);

      var expectedProperties = {
        "1": {
          "age": 23,
          "email": "example@example.com",
          "id": "1",
          "name": "abc",
          "sanitization": {
            "properties": {
              "age": {
                "type": "number"
              },
              "email": {
                "type": "string"
              },
              "id": {
                "type": "string"
              },
              "name": {
                "type": "string"
              }
            },
            "strict": true,
            "type": "object"
          }
        },
        "2": {
          "age": 24,
          "email": "example@example.com",
          "id": "2",
          "name": "abd",
          "sanitization": {
            "properties": {
              "age": {
                "type": "number"
              },
              "email": {
                "type": "string"
              },
              "id": {
                "type": "string"
              },
              "name": {
                "type": "string"
              }
            },
            "strict": true,
            "type": "object"
          }
        }
      };

      assert.deepEqual(
        dummyCollectionEntity.export(),
        expectedProperties
      );

    });

    it("should inflate object of entities", function () {

      var entities = {
        "1": {
          id: "1",
          name: "abc",
          email: "example@example.com",
          age: 23
        },
        "2": {
          id: "2",
          name: "abd",
          email: "example@example.com",
          age: 24
        }
      };

      var dummyCollectionEntity = new DummyCollectionEntity(entities);

      var expectedProperties = {
        "1": {
          "age": 23,
          "email": "example@example.com",
          "id": "1",
          "name": "abc",
          "sanitization": {
            "properties": {
              "age": {
                "type": "number"
              },
              "email": {
                "type": "string"
              },
              "id": {
                "type": "string"
              },
              "name": {
                "type": "string"
              }
            },
            "strict": true,
            "type": "object"
          }
        },
        "2": {
          "age": 24,
          "email": "example@example.com",
          "id": "2",
          "name": "abd",
          "sanitization": {
            "properties": {
              "age": {
                "type": "number"
              },
              "email": {
                "type": "string"
              },
              "id": {
                "type": "string"
              },
              "name": {
                "type": "string"
              }
            },
            "strict": true,
            "type": "object"
          }
        }
      };

      assert.deepEqual(
        dummyCollectionEntity.export(),
        expectedProperties
      );

    });

  });

});
