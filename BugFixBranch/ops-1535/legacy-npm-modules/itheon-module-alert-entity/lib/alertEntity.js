
"use strict";

var BaseEntity = require("itheon-entity").BaseEntity;

class AlertEntity extends BaseEntity
{
  constructor(data)
  {
    super();
    this.setFields({
      id: {"type": 'any'},
      deviceId: {"type": 'string'},
      icon: {"type": 'string'},
      name: {"type": 'string'},
      group: {"type": 'string'},
      entity: {"type": 'string'},
      ruleName: {"type": 'string'},
      brief: {"type": 'object'},
      fullText: {"type": 'string'},
      matchedConditions: {"type": 'array'},
      subscribers: {"type": 'array'},
      occurrences: {"type": 'integer'},
      firstOccurrence: {"type": 'date'},
      lastOccurrence: {"type": 'date'},
      resourceUrl: {"type": 'string'},
      severity: {"type": 'number'},
      state: {"type": 'string'},
      tags: {"type": 'array', def: [], optional: false},
      timeToClose: {"type": 'integer'},
      acknowledged: {"type": 'boolean', def: false, optional: false},
      assignee: {"type": 'string', def: null},
      status: {"type": 'number'},
      createdAt: {"type": 'date'},
      updatedAt: {"type": 'date'}
    });

    if (data) {
      this.inflate(data);
    }

    this.setDbIndexes({
      "createdAt" : "createdAt"
    });
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

module.exports = AlertEntity;
