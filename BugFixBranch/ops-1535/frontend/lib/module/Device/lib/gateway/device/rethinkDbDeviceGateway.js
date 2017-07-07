"use strict";

const appRootPath      = require("app-root-path");
const common            = require("opserve-common");
const RethinkDbGateway  = common.gateway.RethinkDbGateway;
const _                 = common.utilities.underscore;
const GatewayError      = common.gateway.GatewayError;
const logger            = common.logger;
const DeviceEntity     = require("itheon-module-device-entity").DeviceEntity;
const RuleEntity       = require("itheon-module-rule-entity").RuleEntity;

class RethinkDbDeviceGateway extends RethinkDbGateway
{
  /**
   * Cutom contractor allows to pass instance of data provider
   *
   * @param object dataProvider Data provider(i.e. dbConnection)
   */
  constructor(dataProvider)
  {
    super(dataProvider);

    this.table = {
      "name": "Device",
      "alias": "d"
    };

    /**
     * Object describing alert's relation
     *
     * @type Object
     */
    this.relations = {
      "rules": {
        "table": "Rule",
        "localColumn": "id",
        "targetColumn": "deviceId",
        "defaultAlias": "r"
      },
    };

  }

  /**
   * Method fetches all records matching passed request"s criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of DB result
   */
  fetchAll(request)
  {
    var entities = [new DeviceEntity()];

    var joins = request.getJoins();
    if (_.contains(joins, "rules")) {
      entities.push(new RuleEntity());
    }

    return this.query(request, entities);
  }

  /**
   * Method inserts new entity to table
   *
   * @param Device device Device entity
   * @return Promise device Promise of newly created device entity
   */
  create(device)
  {
    if (!(device instanceof DeviceEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of Device expected",
        device,
        500
      );
    }

    // var parent = super;
    return this.validateDevicename(device)
      .then(super.insert.bind(this))
      .then(function (deviceData) {
        return new DeviceEntity(deviceData);
      });
  }

  /**
   * Method updates entity in table
   *
   * @param Device device Device entity
   * @return Promise device Promise of newly created device entity
   */
  update(device)
  {
    if (!(device instanceof DeviceEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of Device expected",
        device,
        500
      );
    }

    // check devicename uniqueness before inserting
    return super.update(device)
      .then(function (deviceData) {
        return new DeviceEntity(deviceData);
      });
  }

  /**
   * Method replaces entity in table
   *
   * @param Device device Device entity
   * @return Promise device Promise of newly created device entity
   */
  replace(device)
  {
    if (!(device instanceof DeviceEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of Device expected"
      );
    }

    return super.replace(device)
      .then(function (deviceData) {
        return new DeviceEntity(deviceData);
      });
  }

  /**
   * Helper method validates devicename to be inserted
   *
   * @param Device device Device entity
   * @return Promise device Promise of exception if devicename exists
   * otherwise promise of passed object
   */
  validateDevicename(device)
  {
    return this.dataProvider.table(this.table.name)
      .getAll(device.get("devicename"), {index: "devicename"})
      .then(function(devices) {
        if (!_.isEmpty(devices)) {
          throw new GatewayError(
            "Devicename already in use",
            {},
            409
          );
        }

        return device;
      });
  }
}

module.exports = RethinkDbDeviceGateway;
