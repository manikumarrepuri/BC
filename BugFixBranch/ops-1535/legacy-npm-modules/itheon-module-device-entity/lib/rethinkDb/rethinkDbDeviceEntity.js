
"use strict";

var BaseEntity = require("itheon-entity").BaseEntity;

class RethinkDbDeviceEntity extends BaseEntity
{
  constructor(data)
  {
    super();

    this.setFields({
      id: {"type": 'string'},
      name: {"type": 'string'},
      group: {"type": 'string'},
      displayName: {"type": 'string'},
      platform: {"type": 'string'},
      alerts: {"type": 'object'},
      status: {"type": 'number'},
      tags: {"type": 'array'},
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

module.exports = RethinkDbDeviceEntity;
