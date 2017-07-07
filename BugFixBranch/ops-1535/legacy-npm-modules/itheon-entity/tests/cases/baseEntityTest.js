"use strict";

var appRootPath = require("app-root-path");
var assert      = require("chai").assert;
var BaseEntity  = require(appRootPath + "/lib/baseEntity");
var EntityError = require(appRootPath + "/lib/entityError");

class DummyEntity extends BaseEntity {
  constructor(data) {
    super();

    this.setFields({
      name: {
        type: "string"
      },
      email: {
        type: "string"
      },
      age: {
        type: "number"
      },
      someBool: {
        type: "boolean"
      },
      indexes: {
        type: "object"
      }
    });

    if (data) {
      this.inflate(data);
    }
  }

  setAge(age) {
    this.age = parseInt(age, 10);
    return this.age;
  }
}

describe("BaseEntity", function () {

  describe("on instantiation of base entity", function () {

    it("should not inflate entity with passed data(as there's no properties)", function () {

      assert.throw(function () {
        new BaseEntity();
      }, "BaseEntity used incorrectly. You need to extend default constructor!");

    });

  });
});


describe("DummyEntity (extension of BaseEntity)", function () {

  describe("constructor()", function () {

    it("should inflate only existing entity's properties", function () {

      var entity = new DummyEntity({
        "name": "abc",
        "email": false,
        "someBool": false,
        "invalid": "ignored"
      });

      var expectedProperties = {
        name: "abc",
        email: "false",
        someBool: false
      };

      assert.deepEqual(
        entity.export(),
        expectedProperties
      );

    });

    it("should inflate only existing entity's properties (using functions if available)", function () {

      var entity = new DummyEntity({
        "name": "abc",
        "email": false,
        "invalid": "ignored",
        "age": 13.2
      });

      var expectedProperties = {
        name: "abc",
        email: "false",
        age: 13
      };

      assert.deepEqual(
        entity.export(),
        expectedProperties
      );

    });

  });

  describe("inflate()", function () {

    it("should inflate only existing entity's properties", function () {

      var entity = new DummyEntity();
      entity.inflate({
        "name": "abc",
        "email": false,
        "someBool": true,
        "invalid": "ignored"
      });

      var expectedProperties = {
        name: "abc",
        email: "false",
        someBool: true
      };

      assert.deepEqual(
        entity.export(),
        expectedProperties
      );

    });

    it("should inflate only existing entity's properties (using functions if available)", function () {

      var entity = new DummyEntity();
      entity.inflate({
        "name": "abc",
        "email": false,
        "invalid": "ignored",
        "age": 13.2
      });

      var expectedProperties = {
        name: "abc",
        email: "false",
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
      assert.deepEqual(dummyEntity.getProperties(), ["name", "email", "age", "someBool", "indexes"]);

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

      var entity = new DummyEntity({
        "name": "abc",
        "email": false,
        "invalid": "ignored"
      });

      entity.set("age", 27);
      entity.set("email", "test@example.com");

      entity.set("non-existing", "ignored");

      let expectedProperties = {
        age: 27,
        email: "test@example.com",
        name: "abc"
      };

      assert.deepEqual(
        entity.export(),
        expectedProperties
      );
    });
  });
});

class AllowAnyEntity extends BaseEntity {
  constructor(data) {
    super();

    this.setFields({
      name: {
        type: "string"
      },
      email: {
        type: "string"
      },
      age: {
        type: "number"
      },
      someBool: {
        type: "boolean"
      }
    });

    this.setAllowAnyField(true);

    if (data) {
      this.inflate(data);
    }
  }

  setAge(age) {
    this.age = parseInt(age, 10);
    return this.age;
  }
}

describe("AllowAnyEntity (extension of BaseEntity)", function () {
  describe("has()", function () {
    it("should return true because property exists", function () {
      var entity = new AllowAnyEntity({
        "name": "abc"
      });

      assert.equal(entity.has('name'), true);
    });

    it("should return false because property doesn't exist", function () {
      var entity = new AllowAnyEntity({
        "name": "abc"
      });

      assert.equal(entity.has('invalid'), false);
    });

    it("should return true because property has been added", function () {
      var entity = new AllowAnyEntity({
        "name": "abc"
      });

      entity.addProperty('invalid');

      assert.equal(entity.has('invalid'), true);
    });
  });

  describe("set()", function () {
    it("should cast data based on entity's properties and allow anything", function () {

      var entity = new AllowAnyEntity({
        "name": "abc",
        "email": false,
        "invalid": "added"
      });

      entity.set("age", 27);
      entity.set("email", "test@example.com");
      entity.set("non-existing", "added");

      let expectedProperties = {
        "age": 27,
        "email": "test@example.com",
        "name": "abc",
        "invalid": "added",
        "non-existing": "added"
      };

      assert.deepEqual(
        entity.export(),
        expectedProperties
      );
    });
  });

  describe("getDataType()", function () {
    it("should return correct dataType", function () {

      var entity = new AllowAnyEntity({
        "name": "abc",
        "email": false,
        "age": 27
      });

      assert.equal(
        entity.getDataType('name'),
        "string"
      );
    });
  });

  describe("getDataType()", function () {
    it("should return correct dataType for new property (any)", function () {
      var entity = new AllowAnyEntity({
        "name": "abc",
        "email": false,
        "age": 27
      });

      entity.set('invalid', "added");

      assert.equal(
        entity.getDataType('invalid'),
        "any"
      );
    });
  });

  describe("getDataTypes()", function () {
    it("should return dataTypes as created", function () {

      var entity = new AllowAnyEntity({
        "name": "abc",
        "email": false,
        "age": 27
      });

      let expectedProperties = {
        "name": "string",
        "email": "string",
        "age": "number",
        "someBool": "boolean",
      };

      assert.deepEqual(
        entity.getDataTypes(),
        expectedProperties
      );
    });
  });

  describe("getDataTypes()", function () {
    it("should return dataTypes as created plus new properties", function () {

      var entity = new AllowAnyEntity({
        "name": "abc",
        "email": false,
        "invalid": "added",
        "age": 27,
        "non-existing": "added"
      });

      let expectedProperties = {
        "name": "string",
        "email": "string",
        "age": "number",
        "someBool": "boolean",
        "invalid": "any",
        "non-existing": "any"
      };

      assert.deepEqual(
        entity.getDataTypes(),
        expectedProperties
      );
    });
  });

  describe("hasDbIndex()", function () {

    it('should return false where there is no "indexes" property', () => {
      let entity = new DummyEntity({
        "name": "abc",
        "email": false,
        "someBool": false
      });

      let output = entity.hasDbIndex("fieldName");
      assert.equal(output, false);

      output = entity.hasDbIndex({
        fieldname: "asc"
      });
      assert.equal(output, false);
    });

    it('should return false where there is an "indexes" property, but not for the property specified', () => {
      let entity = new DummyEntity({
        "name": "abc",
        "email": false,
        "someBool": false,
      });

      entity.setDbIndexes({
        field1: "name_of_db_index"
      });

      let output = entity.hasDbIndex("fieldName");
      assert.equal(output, false);

      output = entity.hasDbIndex({
        fieldName: "asc"
      });
      assert.equal(output, false);

      output = entity.hasDbIndex(["fieldName"]);
      assert.equal(output, false);
    });

    it('should return return true for a single field index that exists', () => {
      let entity = new DummyEntity({
        "name": "abc",
        "email": false,
        "someBool": false,
      });

      entity.setDbIndexes({
        "fieldName": "name_of_db_index"
      });

      let output = entity.hasDbIndex("fieldName");
      assert.equal(output, true, "string input failed");

      output = entity.hasDbIndex({
        "fieldName": "asc"
      });
      assert.equal(output, true, "object input failed");

      output = entity.hasDbIndex(["fieldName"]);
      assert.equal(output, true, "array input failed");

    });

    it('should return return true for a compound index that exists', () => {
      let entity = new DummyEntity({
        "name": "abc",
        "email": false,
        "someBool": false,
      });

      entity.setDbIndexes({
        "fieldName+otherField": "name_of_db_index"
      });

      let output = entity.hasDbIndex("fieldName+otherField");
      assert.equal(output, true, "single input failed to return correct output");

      output = entity.hasDbIndex({
        fieldName: "asc",
        otherField: "asc"
      });
      assert.equal(output, true, "object input failed to return correct output");

      output = entity.hasDbIndex(["fieldName", "otherField"]);
      assert.equal(output, true, "array input failed to return correct output");
    });

    it('should return return false for a compound index that exists, if a mixed sort is specified', () => {
      let entity = new DummyEntity({
        "name": "abc",
        "email": false,
        "someBool": false,
        "indexes": {
          "fieldName+otherField": "name_of_db_index"
        }
      });

      let output = entity.hasDbIndex({
        fieldName: "asc",
        otherField: "desc"
      });
      assert.equal(output, false);

    });
  });

  describe("getDbIndex()", function () {

    it('should return an index name that exists for a single field', () => {
      let entity = new DummyEntity({
        "name": "abc",
        "email": false,
        "someBool": false,
        "indexes": {
          field1: "name_of_db_index"
        }
      });

      let output = entity.getDbIndex("field1");
      assert.equal(output, "name_of_db_index", "string input failed to return the correct output");
      output = undefined;

      output = entity.getDbIndex({"field1" : "asc"});
      assert.equal(output, "name_of_db_index", "object input failed to return the correct output");
      output = undefined;
      
      output = entity.getDbIndex(["field1"]);
      assert.equal(output, "name_of_db_index", "array input failed to return the correct output");
    });

    it('should return an index name that exists for a compound index', () => {
      let entity = new DummyEntity({
        "name": "abc",
        "email": false,
        "someBool": false,
        "indexes": {
          "field1+field2": "name_of_db_index"
        }
      });

      let output = entity.getDbIndex("field1+field2");
      assert.equal(output, "name_of_db_index", "string input failed to return the correct output");
      output = undefined;

      output = entity.getDbIndex({"field1" : "asc", "field2" : "asc"});
      assert.equal(output, "name_of_db_index", "object input failed to return the correct output");
      output = undefined;
      
      output = entity.getDbIndex(["field1", "field2"]);
      assert.equal(output, "name_of_db_index", "array input failed to return the correct output");
    });

    it('should throw if there\'s no indexes property', () => {
      let entity = new DummyEntity({
        "name": "abc",
        "email": false,
        "someBool": false
      });

      assert.throws(() => {
        let output = entity.getDbIndex("fieldXXX");
        // return statement is here to satisfy ESLint that 'output' is used,
        // this call should already have thrown by now.
        return output;
      }, EntityError);

      assert.throws(() => {
        let output = entity.getDbIndex(["fieldXXX"]);
        // return statement is here to satisfy ESLint that 'output' is used,
        // this call should already have thrown by now.
        return output;
      }, EntityError);

      assert.throws(() => {
        let output = entity.getDbIndex({ "fieldXXX": "asc"});
        // return statement is here to satisfy ESLint that 'output' is used,
        // this call should already have thrown by now.
        return output;
      }, EntityError);
    });
    
    it('should throw for a nonexistent index', () => {
      let entity = new DummyEntity({
        "name": "abc",
        "email": false,
        "someBool": false,
        "indexes": {
          "field1": "name_of_db_index"
        }
      });

      assert.throws(() => {
        let output = entity.getDbIndex("fieldXXX");
        // return statement is here to satisfy ESLint that 'output' is used,
        // this call should already have thrown by now.
        return output;
      }, EntityError);

      assert.throws(() => {
        let output = entity.getDbIndex(["fieldXXX"]);
        // return statement is here to satisfy ESLint that 'output' is used,
        // this call should already have thrown by now.
        return output;
      }, EntityError);

      assert.throws(() => {
        let output = entity.getDbIndex({ "fieldXXX": "asc"});
        // return statement is here to satisfy ESLint that 'output' is used,
        // this call should already have thrown by now.
        return output;
      }, EntityError);
    });

    it('should throw for a compound index where a mixed sort has been used', () => {
      let entity = new DummyEntity({
        "name": "abc",
        "email": false,
        "someBool": false,
        "indexes": {
          "field1+field2": "name_of_db_index"
        }
      });

      assert.throws(() => {
        let output = entity.getDbIndex({ "field1": "asc", "field2": "desc" });
        // return statement is here to satisfy ESLint that 'output' is used,
        // this call should already have thrown by now.
        return output;
      }, EntityError);
    });
  });
});