
"use strict";

var BaseEntity = require("itheon-entity").BaseEntity;

class DeviceAlertEntity extends BaseEntity
{
  constructor(data)
  {
    super();

    this.setFields({
      id: {"type": 'string'}
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

module.exports = DeviceAlertEntity;
