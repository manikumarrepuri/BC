
"use strict";

const appRootPath      = require("app-root-path");
const common            = require("opserve-common");
const RethinkDbGateway  = common.gateway.RethinkDbGateway;
const _                 = common.utilities.underscore;
const GatewayError      = common.gateway.GatewayError;
const logger            = common.logger;
const DeviceEntity     = require("itheon-module-device-entity").DeviceEntity;
const RuleEntity       = require("itheon-module-rule-entity").RuleEntity;

class RethinkDbAlertGateway extends RethinkDbGateway
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
      "name": "Alert",
      "alias": "a"
    };

    /**
     * Object describing alert's relation
     *
     * @type Object
     */
    this.relations = {
      "device": {
        "table": "Device",
        "localColumn": "deviceId",
        "targetColumn": "id",
        "defaultAlias": "d"
      },
    };
  }
}

module.exports = RethinkDbAlertGateway;
