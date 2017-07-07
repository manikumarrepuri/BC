
"use strict";

var appRoot    = require("app-root-path");
var assert     = require("chai").assert;
var BaseEntity = require(appRoot + "/lib/entity/baseEntity");

class DummyEntity extends BaseEntity
{
  constructor(data)
  {
    var fields = {
      id: {"type": 'string'},
      name: {"type": 'string'},
      email: {"type": 'string'},
      age: {"type": 'number'}
    }

    super(fields);

    if (data) {
      this.inflate(data);
    }
  }
}

module.exports = DummyEntity;
