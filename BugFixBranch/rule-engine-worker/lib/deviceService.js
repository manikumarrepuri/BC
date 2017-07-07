"use strict";

var crypto                  = require("crypto");

const common                = require('opserve-common');
const _                     = common.utilities.underscore;
const logger                = common.logger;
const DeviceServiceError    = common.error.DeviceServiceError;

var appRootPath             = require("app-root-path");
var DeviceMongoDbGateway    = require(appRootPath + "/lib/deviceMongoDbGateway.js");
var DeviceMemoryGateway     = require("./deviceMemoryGateway");
var DeviceRedisGateway      = require("./deviceRedisGateway");

var TagMongoDbGateway       = require(appRootPath + "/lib/tagMongoDbGateway.js");
var BaseEntity              = require("itheon-entity").BaseEntity;
var PerformanceEntity       = require("itheon-module-performance-entity").PerformanceEntity;
var DeviceEntity            = require("itheon-module-device-entity").DeviceEntity;
var MetricEntity            = require("itheon-module-metric-entity").MetricEntity;

var BaseService             = require("itheon-service").BaseService;

class DeviceService extends BaseService
{

  /**
   * Custom constructor allows to set gateways
   *
   * @param object gateways List of gateways to assign
   * keys (db, memory and cache)
   */
  constructor(gateways)
  {
    super();

    if (!gateways) {
      gateways = {};
    }

    if (!gateways.hasOwnProperty("db")) {
      gateways.db = DeviceMongoDbGateway;
    }

    if (!gateways.hasOwnProperty("memory")) {
      gateways.memory = new DeviceMemoryGateway();
    }

    if (!gateways.hasOwnProperty("cache")) {
      gateways.cache = new DeviceRedisGateway();
    }

    this.tagGateway = TagMongoDbGateway;


    this.setGateways(gateways);
  }

  /**
   * Method returns devices with rules form current gateway
   *
   * @param array devicesList List of devices
   * @return Promise result Promise of query result
   */
  getDevicesWithRules(devicesList)
  {
    logger.info(
      "DeviceService: Getting devices with rules from " + this.getGatewayName()
    );

    return this.gateway.getWithRules(devicesList)
          .then(function(results){

      if (_.isObject(results)) {
        results = _.values(results);
      }

      if (!_.isArray(results)) {
        throw new Error(
          "Invalid result from gateway"
        );
      }

      _(results).forEach(function(device) {
        if (!_.isObject(device)) {
          throw new Error(
            "Invalid enity returned from gateway. Object expected"
          );
        }
      });

      return results;
    });
  }

  /**
   * Method stores devices
   *
   * @param object devices List of devices
   * @return Promise result Promise of returning list of devices
   * (push forward for further usage)
   */
  save(devices)
  {
    logger.info(
      "DeviceService: Upserting devices into " + this.getGatewayName()
    );

    logger.silly(
      "Devices: ",
      devices
    )

    if (!_.isArray(devices)) {
      devices = [devices];
    }

    // safety check from some wierd stuff
    devices = _.values(devices);

    return Promise.all(devices.map(function(device) {
        // Remove merged rules

        device.mergedRules = undefined;

        // If we're saving to the database create and store tags
        if(this.getGatewayName() == "db") {
          logger.info(
            "DeviceService: Generating tags for " +
            device.group + ":" + device.name +
            " into " + this.getGatewayName(),
            device
          );

          //add device tags
          device.tags.push(...[
            "system:customer:" + device.group,
            "system:host:" + device.name,
            "system:platform:" + device.platform
          ]);

          var tags = [];
          var date = new Date();

          tags.push(...[{
            id: "system:customer:" + device.group,
            group: "system",
            type: "customer",
            value: device.group,
            description: "Customer tag",
            color: null,
            defaultColor: "#80B5D3",
            createdAt: date,
            status: 1,
            weight: 1000
          },
          {
            id: "system:host:" + device.name,
            group: "system",
            type: "host",
            value: device.name,
            description: "Device name tag",
            color: null,
            defaultColor: "#80B5D3",
            createdAt: date,
            status: 1,
            weight: 1000
          }]);

          this.tagGateway.save(tags, function (data) {
            return;
          });
        }

        logger.info(
          "DeviceService: Storing device " +
          device.group + ":" + device.name +
          " into " + this.getGatewayName(),
          device
        );

        return this.getGateway().save(device);

    }.bind(this))).then(function() {

      logger.info(
        "DeviceService: Saving devices into " +
        this.getGatewayName() + " finished"
      );

      return devices;
    }.bind(this));
  }

  /**
   * Method gets device from current gateway by passed params
   *
   * @param object query Query object is expected to have at least one of
   * following properties:
   * {
   *   name: ",
   *   group: "
   * }
   * @return Promise result Promise of result of matching devices
   */
  getDevices(query)
  {
    logger.info(
      "DeviceService: Getting devices by query object " +
      "from " + this.getGatewayName()
    );

    if (!_.isObject(query) || (!_.has(query, "name") && !_.has(query, "group"))) {
      throw new Error(
        "Invalid query object passed. " +
        "Object containing at least name or group property expected"
      );
    }

    return this.getGateway().getDevices(query)
      .then(function(devices) {

        if (!_.isArray(devices)) {
          devices = [devices];
        }

        return devices;
      });
  }

  /**
   * Method returns devices list from current gateway
   *
   * @return Promise result Promise of returning a devices list
   */
  getDeviceNamesList()
  {
    logger.info(
      "DeviceService: Getting device names list from " + this.getGatewayName()
    );

    return this.getGateway().getDeviceNamesList();
  }

  /**
   * Method merges current device object with performance entity
   *
   * @param object            device            Device object
   * @param PerformanceEntity performanceEntity Performance entity
   * @return object
   */
  mergeMetrics(device, performanceEntity)
  {
    logger.info(
      "DeviceService: Merging incoming performance data into device object"
    );

   if (!_.isObject(device)) {
      throw new Error(
        "Invalid device entity passed to merging metrics method",
        {
          device: device
        }
      );
    }

    if (!_.isObject(performanceEntity)) {
      throw new Error(
        "Invalid performance entity passed to merging metrics method",
        {
          performanceEntity: performanceEntity
        }
      );
    }

    var newMetrics = performanceEntity.metrics || {};
    if(!device.metrics) {
      device.metrics = {};
    }

    if(performanceEntity.platform != "question") {
      device.platform = performanceEntity.platform;
    }

    for (let key in newMetrics)
    {
      if (!newMetrics.hasOwnProperty(key))
      {
        continue;
      }

      if (!device.metrics.hasOwnProperty(key))
      {
        device.metrics[key] = newMetrics[key];
      }
      else
      {
        _.extend(device.metrics[key], newMetrics[key]);
      }
    }

    return device;
  }
}

module.exports = DeviceService;
