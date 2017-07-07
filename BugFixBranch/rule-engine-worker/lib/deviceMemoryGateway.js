
"use strict";
const common        = require("opserve-common");
const _             = common.utilities.underscore;
const GatewayError  = common.gateway.GatewayError;
const BaseGateway   = common.gateway.BaseGateway;
const memoryGateway = common.gateway.MemoryGateway;
var BaseEntity    = require("itheon-entity").BaseEntity;

class DeviceMemoryGateway extends BaseGateway
{
  constructor()
  {
    super();
    this.memoryGateway = memoryGateway;
    this.collectionName = "devices";
  }

  set(key, value)
  {
    return this.memoryGateway.set(this.collectionName, key, value);
  }

  get(key)
  {
    return this.memoryGateway.get(this.collectionName, key);
  }

  delete(key)
  {
    return this.memoryGateway.get(this.collectionName, key);
  }

  /**
   *
   */
  getDevices(query)
  {
    if (!_.isObject(query)) {
      throw new GatewayError(
        "Invalid query object passed. Object expected"
      );
    }

    if (!_.has(query, "name") && !_.has(query, "group")) {
      throw new GatewayError(
        "Invalid query object passed. " +
        "Object containing at least name or group property expected"
      );
    }

    var deviceKey = this.getDeviceKey(query);
    return this.get(deviceKey)
      .then(function(result) {
        return {
          [deviceKey] : result
        };
      });
  }

  /**
   * Method stores device in memory
   *
   * @param object devices List of devices
   * @return object devices List of devices (push forward for further usage)
   */
  save(device)
  {
    return this.memoryGateway.set(
      this.collectionName,
      this.getDeviceKey(device),
      device
    ).then(function() {
      return device;
    });
  }

  /**
   * Method stores device into memory
   *
   * @param object device Device object
   * @param string hash   Device hash
   * @return Promise result Promise of result of saving
   */
  saveHash(device, hash)
  {
    return this.memoryGateway.set(
      this.collectionName + "Hashes",
      this.getDeviceHashKey(device),
      hash
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
      throw new GatewayError(
        "Invalid query object passed. Object expected"
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
   * Method generates device hash key used to cache device hash
   *
   * @return string deviceHashKey Key for device hash
   */
  getDeviceHashKey(device)
  {
    return "deviceHash:" + device.group + ":" + device.name;
  }
}

module.exports = DeviceMemoryGateway;
