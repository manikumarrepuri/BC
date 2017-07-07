
"use strict";

var config = require("itheon-config").ConfigFactory.getConfig();
var logger = require("itheon-logger");
var _      = require("itheon-utility").underscore;

class RedisDataProvider
{
  getRedisDataProvider()
  {
    if (!this.redis) {
      var Redis = require("ioredis");
      this.config = config.get('redis');

      if (_.isArray(this.config) && !this.config.sentinels) {
        this.redis = new Redis.Cluster(this.config);
      } else {
        this.redis = new Redis(this.config);
      }

      // Error handling
      Redis.Promise.onPossiblyUnhandledRejection(function(error) {
        logger.error(
          "Unhandled rejection from Redis",
          {
            error: error
          }
        );
      });

      this.redis.on('error', function(error) {
        logger.error(
          "Redis Error",
          {
            error: error
          }
        );
      });
    }

    return this.redis;
  }
}

module.exports = new RedisDataProvider();
