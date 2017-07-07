"use strict";

var common       = require('opserve-common');
var _            = common.utilities.underscore;
const logger     = common.logger;
const RedisGateway = common.gateway.RedisGateway;
const BaseError    = common.error.BaseError;

class DeviceRedisGateway extends RedisGateway
{
  constructor(redisClient)
  {
    super(redisClient);
  }
  /**
   * Method gets devices based on passed device"s names list
   *
   * @param array devicesList List of device"s names to be fetched from cache
   * @return Promise result Promise of returning list of fetched devices
   */
  getWithRules(devicesList)
  {
    logger.info(
      "DeviceRedisGateway: getting device with rules from redis (getWithRules method)"
    );

    logger.silly(
      "Device List:",
      {
        devicesList: devicesList
      }
    );

    if (_.isArray(devicesList) && _.isEmpty(devicesList)) {
      return {};
    }

    return this.hgetall(devicesList)
      .then(function(results) {

        logger.info(
          "DeviceRedisGateway: redis result returned (getWithRules->hgetall method)"
        );

        logger.silly(
          "Rule List:",
          {
            results: results
          }
        );

        if (_.isEmpty(results)) {
          return {};
        }

        results = {
          [devicesList]: results
        };

        var devices = {};
        _(results).forEach(function(device, deviceKey) {

          if (device === null) {
            devices[deviceKey] = null;
            return false;
          }

          devices[deviceKey] = device;
        });

        return devices;
      });
  }

  /**
   *
   */
  getDevices(query)
  {
    logger.info(
      "DeviceRedisGateway: getting device from redis (getDevices method)"
    );

    logger.silly(
      "Redis query:",
      {
        query: query
      }
    );

    if (!_.isObject(query) || (!_.has(query, "name") && !_.has(query, "group"))) {
      throw new BaseError(
        "Invalid query object passed. " +
        "Object containing at least name or group property expected"
      );
    }

    return this.getWithRules(this.getDeviceKey(query));
  }

  /**
   * Method stores device in Redis
   *
   * @param object device
   */
  save(device)
  {
    if (!_.isObject(device)) {
      throw new BaseError(
        "Invalid device object passed. Object expected"
      );
    }

    var tempDevice = _.clone(device);

    _(tempDevice).forEach(function(value, propertyName) {
      if (_.isArray(value) || _.isObject(value)) {
        tempDevice[propertyName] = JSON.stringify(value);
        return;
      }

      tempDevice[propertyName] = value;
    });

    return this.hmset(
      this.getDeviceKey(tempDevice),
      tempDevice
    ).then(function() {
      return device;
    });
  }

  /**
   * Method generates device key used to cache device data
   *
   * @return string deviceKey Key for device data
   */
  getDeviceKey(device)
  {
    if (!_.isObject(device)) {
      throw new BaseError(
        "Invalid device object passed. Object expected"
      );
    }

    if (!_.has(device, "group")) {
      device.group = "*";
    }

    if (!_.has(device, "name")) {
      device.name = "*";
    }

    return "device:" + device.group + ":" + device.name;
  }

  /**
   * Method returns device names
   *
   * @return Promise result Promise of result (device names list)
   */
  getDeviceNamesList()
  {
    return this.keys("device:*");
  }
}

module.exports = DeviceRedisGateway;
