
"use strict";

var DeviceEntity     = require("itheon-module-device-entity").DeviceEntity;
var common           = require('opserve-common');
var _                = common.utilities.underscore;
const logger         = common.logger;
const GatewayError     = common.gateway.GatewayError;
const RethinkDbGateway = common.gateway.RethinkDbGateway;

var RethinkDbDeviceEntity = require("itheon-module-device-entity").RethinkDbDeviceEntity;

class DeviceRethinkDbGateway extends RethinkDbGateway
{
  /**
   * Custom constructor sets table name and alias and
   * allows to pass custom data provider
   */
  constructor(dataProvider)
  {
    super(dataProvider);

    this.table = {
      name: "Device",
      alias: "d"
    };

    /**
     * Object describing device's relation
     *
     * @type Object
     */
    this.relations = {};
  }

  /**
   * Method returns devices with nested rules
   *
   * @return Promise result Promise of fetched devices
   */
  getWithRules()
  {
    var r = this.dataProvider;
    return r.table("Device").merge(
      function(device) {
        return {
          "rules": r.table("Rule").filter(
            {
              deviceId : device("id")
            }
          ).coerceTo("array")
        };
      }
    ).orderBy("group", "name").run()
    .then(function(results) {

      var devices = [];
      _(results).forEach(function(device){
        devices.push(device);
      });

      return devices;
    });
  }

  /**
   * Method stores device in Rethink DB
   *
   * @param object device
   */
  save(device)
  {
    logger.info(
      "DeviceRethinkDbGateway: Saving device in RethinkDb"
    );

    var rethinkDbDevice = new RethinkDbDeviceEntity({
      id: device.id,
      name: device.name,
      group: device.group,
      displayName: device.displayName,
      platform: device.platform,
      alerts: device.alerts,
      tags: device.tags,
      status: 1,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt
    });

    return this.insert(rethinkDbDevice)
      .then(function() {
        return device;
      });
  }

  /**
   * Method required by service - rethinkdb doesnt store hashes at
   * current moment
   *
   * @param object device Device object
   * @param string hash   Device hash
   * @return null
   */
  saveHash(device, hash)
  {
    return null;
  }
}

module.exports = DeviceRethinkDbGateway;
