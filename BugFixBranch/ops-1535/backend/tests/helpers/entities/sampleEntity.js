
"use strict";

var appRootPath = require("app-root-path");
var BaseEntity  = require(appRootPath + "/lib/entity/baseEntity");

/**
 * Sample entity class definition
 */
class SampleEntity extends BaseEntity
{
  constructor(data)
  {
    super();

    this.id = null;
    this.name = null;
    this.width = null;
    this.height = null;
    this.ticketId = null;

    if (data) {
      this.inflate(data);
    }
  }

  getId()
  {
    return this.id;
  }

  setId(id)
  {
    this.id = id;
  }
}

module.exports = SampleEntity;
