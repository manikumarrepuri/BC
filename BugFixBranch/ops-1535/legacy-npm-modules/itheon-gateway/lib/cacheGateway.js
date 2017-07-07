
"use strict";

var GatewayError = require("./gatewayError");
var BaseGateway  = require("./baseGateway");

class CacheGateway extends BaseGateway
{
  constructor(cacheConnection)
  {
    super();
    if (!cacheConnection) {
      var redisDataProvider = require("itheon-data-provider").redisDataProvider;
      cacheConnection = redisDataProvider.getRedisDataProvider();
    }

    this.cacheConnection = cacheConnection;
  }

  set(key, value)
  {
    throw new GatewayError(
      'This method needs to be implemented by extending classes'
    );
  }

  get(key)
  {
    throw new GatewayError(
      'This method needs to be implemented by extending classes'
    );
  }

  delete(key)
  {
    throw new GatewayError(
      'This method needs to be implemented by extending classes'
    );
  }
}

module.exports = CacheGateway;
