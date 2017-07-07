
"use strict";

var BaseEntity = require("itheon-entity").BaseEntity;

class AclRuleEntity extends BaseEntity
{
  constructor(data)
  {
    super();
    this.setFields({
      id: {"type": 'string'},
      role: {"type": 'string'},
      resource: {"type": 'string'},
      action: {"type": 'string'},
      type: {"type": 'string'},
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

module.exports = AclRuleEntity;
