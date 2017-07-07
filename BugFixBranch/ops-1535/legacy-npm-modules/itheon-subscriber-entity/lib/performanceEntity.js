
"use strict";

var BaseEntity = require("itheon-entity").BaseEntity;

class PerformanceEntity extends BaseEntity
{
  constructor(data)
  {

    super();

    this.setFields({
      eventType: {"type": 'number'},
      valid: {"type": 'boolean'},
      sequenceNumber: {"type": 'number'},
      customerId: {"type": 'string'},
      dateTime: {"type": 'any'},
      timeOfDay: {"type": 'any'},
      computerName: {"type": 'string'},
      updatedAt: {"type": 'date'},
      originalMessage: {"type": 'string'}
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

module.exports = PerformanceEntity;
