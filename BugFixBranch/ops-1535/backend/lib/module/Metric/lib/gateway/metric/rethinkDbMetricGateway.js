
"use strict";

var appRootPath      = require("app-root-path");
const common            = require("opserve-common");
const RethinkDbGateway  = common.gateway.RethinkDbGateway;
const _                 = common.utilities.underscore;
const GatewayError      = common.gateway.GatewayError;
const logger            = common.logger;
var MetricEntity     = require("itheon-module-metric-entity").MetricEntity;
var DeviceEntity     = require("itheon-module-device-entity").DeviceEntity;


class RethinkDbMetricGateway extends RethinkDbGateway
{
  /**
   * Cutom contractor allows to pass gateway instance
   *
   * @param object gateway Mapper's gateway(i.e. dbConnection)
   */
  constructor(gateway)
  {
    super(gateway);

    this.table = {
      "name": "Metric",
      "alias": "m"
    };

    /**
     * Object describing metric's relation
     *
     * @type Object
     */
    this.relations = {
      "device": {
        "table": "device",
        "localColumn": "deviceId",
        "targetColumn": "id",
        "defaultAlias": "d"
      },
    };
  }

  /**
   * Method fetches all records matching passed request's criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of DB result
   */
  fetchAll(request)
  {
    var entities = [new MetricEntity()];
    var joins = request.getJoins();
    if (_.contains(joins, "device")) {
      entities.push(new DeviceEntity());
    }
    return this.query(request, entities);
  }

  /**
   * Method inserts new entity to table
   *
   * @param MetricEntity metricEntity Metric entity
   * @return Promise metric Promise of newly created metric entity
   */
  create(metricEntity)
  {
    logger.info("RethinkDbMetricGateway::insert - metric received", {
      metricEntity: metricEntity
    });

    if (!(metricEntity instanceof MetricEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of MetricEntity expected",
        {
          metricEntity: metricEntity
        },
        500
      );
    }

    return super.insert(metricEntity)
      .then(function (metricData) {
        return new MetricEntity(metricData);
      });
  }

  /**
   * Method updates entity in table
   *
   * @param MetricEntity metricEntity Metric entity
   * @return Promise metric Promise of newly created metric entity
   */
  update(metricEntity)
  {
    if (!(metricEntity instanceof MetricEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of Metric expected",
        {
          metricEntity: metricEntity
        },
        500
      );
    }

    return super.update(metricEntity)
      .then(function (metricData) {
        return new MetricEntity(metricData);
      });
  }

  /**
   * Method replaces entity in table
   *
   * @param MetricEntity metricEntity Metric entity
   * @return Promise metric Promise of newly created metric entity
   */
  replace(metricEntity)
  {
    if (!(metricEntity instanceof MetricEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of MetricEntity expected",
        {
          metricEntity: metricEntity
        }
      );
    }

    return super.replace(metricEntity)
      .then(function (metricData) {
        return new MetricEntity(metricData);
      });
  }
}

module.exports = RethinkDbMetricGateway;
