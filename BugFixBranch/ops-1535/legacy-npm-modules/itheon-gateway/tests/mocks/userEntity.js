
"use strict";

var BaseEntity = require("itheon-entity").BaseEntity;

class UserEntity extends BaseEntity
{
  constructor(data)
  {
    super();

    this.setFields({
      id: {"type": 'any'},
      username: {"type": 'string'},
      password: {"type": 'string'},
      email: {"type": 'string'},
      firstName: {"type": 'string'},
      lastName: {"type": 'string'},
      age: {"type": "number"},
      title: {"type": 'string'},
      avatar: {"type": 'string'},
      status: {"type": 'number'},
      roleId: {"type": 'string'},
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

module.exports = UserEntity;
