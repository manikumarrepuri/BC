"use strict";

var RedisGateway = require("../../lib/redisGateway");

class RedisUserGateway extends RedisGateway
{
  constructor(client) {
    super(client);
  }
}

module.exports = RedisUserGateway;