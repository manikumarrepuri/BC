
"use strict";

var BaseEntity = require("itheon-entity").BaseEntity;

class ReminderEntity extends BaseEntity
{
  constructor(data)
  {
    super();
    this.setFields({
      id: {"type": 'any'},
      deviceId: {"type": 'string'},
      name: {"type": 'string'},
      group: {"type": 'object'},
      state: {"type": 'object'},
      assignedResource: {"type": 'object'},
      schedule: {"type": "string"},
      briefText: {"type": 'string'},
      fullText: {"type": 'string'},
      state: {"type": 'object'},
      status: {"type": 'number'},
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

module.exports = ReminderEntity;
