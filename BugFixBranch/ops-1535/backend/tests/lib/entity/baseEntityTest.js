
"use strict";

var appRoot    = require("app-root-path");
var assert     = require("chai").assert;
var BaseEntity = require(appRoot + "/lib/entity/baseEntity");

class DummyEntity extends BaseEntity
{
  constructor(data)
  {
    var fields = {
      name: {type: 'string'},
      email: {type: 'any'},
      age: {type: 'integer'},
    }

    super(fields);

    if (data) {
      this.inflate(data);
    }
  }
}

describe("BaseEntity", function() {

  describe("on instantiation of base entity", function () {

    it("should not inflate entity with passed data(as there's no properties)", function () {

      assert.throw(function() {
        new BaseEntity();
      }, "BaseEntity used incorrectly. You need to extend default constructor!");

    });

  });
});


describe("DummyEntity (extension of BaseEntity)", function() {

  describe("constructor()", function () {

    it("should inflate only existing entity's properties", function () {

      var entity = new DummyEntity(
        {
          "name": "abc",
          "email": false,
          "invalid": "ignored"
        }
      );

      var expectedProperties = {
        name: "abc",
        email: false
      };

      assert.deepEqual(
        entity.export(),
        expectedProperties
      );

    });

    it("should inflate only existing entity's properties (using functions if available)", function () {

      var entity = new DummyEntity(
        {
          "name": "abc",
          "email": false,
          "invalid": "ignored",
          "age": 13.2
        }
      );

      var expectedProperties = {
        name: "abc",
        email: false,
        age: 13
      };

      assert.deepEqual(
        entity.export(),
        expectedProperties
      );

    });

  });

  describe("constructor()", function () {

    it("should inflate only existing entity's properties", function () {

      var entity = new DummyEntity();
      entity.inflate(
        {
          "name": "abc",
          "email": false,
          "invalid": "ignored"
        }
      );

      var expectedProperties = {
        name: "abc",
        email: false
      };

      assert.deepEqual(
        entity.export(),
        expectedProperties
      );

    });

    it("should inflate only existing entity's properties (using functions if available)", function () {

      var entity = new DummyEntity();
      entity.inflate(
        {
          "name": "abc",
          "email": false,
          "invalid": "ignored",
          "age": 13.2
        }
      );

      var expectedProperties = {
        name: "abc",
        email: false,
        age: 13
      };

      assert.deepEqual(
        entity.export(),
        expectedProperties
      );

    });

  });

  describe("getProperties()", function () {

    it("should return list of entity's properties", function () {

      let dummyEntity = new DummyEntity();
      assert.deepEqual(dummyEntity.getProperties(), ["name", "email", "age"]);

    });

  });

  describe("has()", function () {

    it("should return valid results when both existing and non-existing properties passed", function () {

      let dummyEntity = new DummyEntity({
        "name": null,
        "email": false,
        "invalid": "ignored",
        "age": 15.6
      });

      assert.equal(dummyEntity.has("name"), true);
      assert.equal(dummyEntity.has("email"), true);
      assert.equal(dummyEntity.has("age"), true);

      assert.equal(dummyEntity.has("xyz"), false);

    });

  });

  describe("set()", function () {

    it("should filter data based on entity's properties", function () {

      var entity = new DummyEntity(
        {
          "name": "abc",
          "email": false,
          "invalid": "ignored"
        }
      );

      entity.set("age", 27.6);
      entity.set("email", "test@example.com");

      entity.set("non-existing", "ignored");

      let expectedProperties = {
        name: "abc",
        email: "test@example.com",
        age: 27
      };

      assert.deepEqual(
        entity.export(),
        expectedProperties
      );

    });

  });

  describe("getDataType()", function () {
    it("should return entity dataType for given property", function () {

      var entity = new DummyEntity(
        {
          "name": "abc",
          "email":  "test@example.com",
          "invalid": "ignored"
        }
      );

      let expectedProperties = "string";

      assert.deepEqual(
        entity.getDataType("name"),
        expectedProperties
      );

    });
  });

  describe("getDataTypes()", function () {
    it("should return object with all fields and there dataTypes", function () {

      var entity = new DummyEntity(
        {
          "name": "abc",
          "email":  "test@example.com",
          "invalid": "ignored"
        }
      );

      let expectedProperties = {
        name: 'string',
        email: 'any',
        age: 'integer'
      }

      assert.deepEqual(
        entity.getDataTypes(),
        expectedProperties
      );

    });
  });

});
