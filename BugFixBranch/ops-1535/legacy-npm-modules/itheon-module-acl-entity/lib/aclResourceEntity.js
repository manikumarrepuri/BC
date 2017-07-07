
"use strict";

var BaseEntity = require("itheon-entity").BaseEntity;

class AclResourceEntity extends BaseEntity
{
  constructor(data)
  {
    super();
    this.setFields({
      id: {"type": 'string'},
      name: {"type": 'string'},
      description: {"type": 'string'},
      actions: {"type": 'array'},
      status: {"type": 'number', def: 1},
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

module.exports = AclResourceEntity;
