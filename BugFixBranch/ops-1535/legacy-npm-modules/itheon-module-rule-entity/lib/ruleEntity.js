
"use strict"

var BaseEntity = require("itheon-entity").BaseEntity;

class RuleEntity extends BaseEntity
{
  constructor(data)
  {
    super();
    this.setFields({
      id: {"type": 'any'},
      collection: {"type": 'string'},
      name: {"type": 'string'},
      deviceId: {"type": 'string'},
      definition: {"type": 'object'},
      subscribers: {"type": 'object'},
      eventDetails: {"type": 'object'},
      thresholds: {"type": 'object'},
      handleWhen: {"type": 'object'},
      enabled: {"type": 'boolean'},
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

module.exports = RuleEntity;
