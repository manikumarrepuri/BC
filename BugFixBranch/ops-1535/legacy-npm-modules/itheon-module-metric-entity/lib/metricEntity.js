
"use strict";

var BaseEntity = require("itheon-entity").BaseEntity;

class MetricEntity extends BaseEntity
{
  constructor(data)
  {
    super();

    this.setFields({
      id: {"type": 'any'},
      name: {"type": 'string'},
      entity: {"type": 'string'},
      entityType: {"type": 'string'},
      deviceId: {"type": 'string'},
      value: {"type": 'number'},
      type: {"type": 'string'},
      occurred: {"type": 'string'},
      createdAt: {"type": 'date'}
    });

    this.set('createdAt', Math.floor(Date.now() / 1000));

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

  getValue()
  {
    return this.value;
  }

  getName()
  {
    return this.name;
  }
}

module.exports = MetricEntity;
