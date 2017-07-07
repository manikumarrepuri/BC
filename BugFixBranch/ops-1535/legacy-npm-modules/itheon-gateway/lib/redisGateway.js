
"use strict";

var GatewayError = require("./gatewayError");
var CacheGateway = require("./cacheGateway");
var _            = require("itheon-utility").underscore;

class RedisGateway extends CacheGateway
{
  constructor(redisClient) {
    super(redisClient);
  }
  /**
   * Method stores key => value pair in redis
   *
   * @param string key   Key
   * @param string value Value
   * @return Promise result Promise (just to make it consistent)
   */
  set(key, value)
  {
    return new Promise(function(resolve, reject) {
      resolve(this.cacheConnection.set(key, value));
    }.bind(this));
  }

  /**
   * Method retrieves value from Redis fetched by key
   *
   * @param string|array key Redis key or keys to be retrived
   * @return Promise result Promise of result
   */
  get(key)
  {
    if (_.isArray(key)) {
      return this.mget(key);
    }

    return this.cacheConnection.get(key)
      .then(function (result) {
        return _.object([key], [result]);
      });
  }

  /**
   * Method retrieves multiple values from Redis fetched by key
   *
   * @param Array keys Redis keys to be retrived
   * @return Promise result Promise of result object:
   * {
   *   key1: value1,
   *   key2: value2
   * }
   */
  mget(keys)
  {
    let parallelFunctions = [];
    let that = this;

    _(keys).forEach(function(key) {
      parallelFunctions.push(
        new Promise(function(resolve, reject) {
          return that.get(key).then(function(result) {
            resolve(result);
          });
        })
      );
    });

    return Promise.all(parallelFunctions)
      .then(function(results) {

        let mergedResult = {};
        _(results).forEach(function(result) {
          mergedResult = _.extend(mergedResult, result);
        });

        return mergedResult;
      });
  }

  /**
   * Method retrieves matching key names from Redis
   *
   * @param string pattern Key pattern to be matched by Redis
   * @return Promise result Promise of result
   */
  keys(pattern)
  {
    return this.cacheConnection.keys(pattern);
  }

  /**
   * Method deletes key from Redis
   *
   * @param string key Redis key to be deleted
   * @return object result ioRedis result object
   */
  delete(key)
  {
    return this.cacheConnection.del(key);
  }

  /**
   * Method sets hash key in Redis
   *
   * @param string key   Redis key to be set
   * @param object value Key => Value pairs
   * @return object result ioRedis result object
   */
  hmset(key, value)
  {
    return this.cacheConnection.hmset(key, value);
  }

  /**
  * Method gets all hash keys
  *
  * @param string key Key to be retrieved
  * @param string field Field to be retrieved from key
  * @return object result
  */
  hget(key, field)
  {
    return this.cacheConnection.hget(key, field)
      .then(function(result) {
        try {
          result = JSON.parse(result);
        } catch (e) {}

        return result;
      });
  }

  /**
   * Method gets all hash keys
   *
   * @param string key Key to be retrieved
   * @return object result
   */
  hgetall(key)
  {
    return this.cacheConnection.hgetall(key)
      .then(function(result) {
        _(result).forEach(function(value, propertyName) {
          try {
            var parsedValue = JSON.parse(value);
            result[propertyName] = parsedValue;
          } catch (e) {
            result[propertyName] = value;
          }
        });

        return result;

      });
  }
}

module.exports = RedisGateway;
