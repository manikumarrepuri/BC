
"use strict";

var BaseEntity = require("itheon-entity").BaseEntity;

class DataEntity extends BaseEntity
{
  constructor(data)
  {
    super();

    this.setFields({
      id: {"type": 'string'},
      createdAt: {"type": 'date'},
      updatedAt: {"type": 'date'}
    });

    this.setAllowAnyField(true);

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
    return id;
  }
}

module.exports = DataEntity;
