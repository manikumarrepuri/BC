
"use strict";

var BaseEntity = require("itheon-test").stubs.baseEntity;

class DummyEntity extends BaseEntity
{
  constructor(data)
  {
    super();

    this.setFields({
      id: {type: "string"},
      name: {type: "string"},
      email: {type: "string"},
      age: {type: "number"},
      someBool: {type: "boolean"}
    });

    if (data) {
      this.inflate(data);
    }
  }

  setAge(age)
  {
    return this.age = parseInt(age, 10);
  }
}

module.exports = DummyEntity;
