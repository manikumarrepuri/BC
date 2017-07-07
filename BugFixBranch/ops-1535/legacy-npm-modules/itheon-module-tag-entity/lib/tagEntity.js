
"use strict";

var BaseEntity = require("itheon-entity").BaseEntity;

class TagEntity extends BaseEntity
{
  constructor(data)
  {
    super();
    this.setFields({
      id: {"type": 'string'},
      name: {"type": 'string'},
      description: {"type": 'string'},
      color: {"type": 'string'},
      defaultColor: {"type": 'string'},
      status: {"type": 'number'},
      group: {"type": 'string'},
      type: {"type": 'string'},
      value: {"type": 'string'},
      createdAt: {"type": 'date'},
      updatedAt: {"type": 'date'}
    });

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

module.exports = TagEntity;
