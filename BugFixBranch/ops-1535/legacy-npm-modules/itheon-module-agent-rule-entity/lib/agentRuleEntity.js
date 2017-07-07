
"use strict"

var BaseEntity = require("itheon-entity").BaseEntity;

class AgentRuleEntity extends BaseEntity
{
  constructor(data)
  {
    super();
    this.setFields({
      id: {"type": 'any'},
      version: {"type": 'string'},
      name: {"type": 'string'},
      content: {"type": 'string'},
      description: {"type": 'string'},
      fileName: {"type": 'string'},
      results: {"type": 'object'},
      tags: {"type": 'array'},
      failed: {"type": 'object'},
      started: {"type": 'object'},
      success: {"type": 'object'},
      status: {"type": 'number', def: 1},
      agentRuleId: {"type": 'object'},
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

module.exports = AgentRuleEntity;
