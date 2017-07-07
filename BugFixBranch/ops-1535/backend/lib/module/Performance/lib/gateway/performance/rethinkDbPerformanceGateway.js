
"use strict";

var appRootPath       = require("app-root-path");
const common            = require("opserve-common");
const RethinkDbGateway  = common.gateway.RethinkDbGateway;
const _                 = common.utilities.underscore;
const GatewayError      = common.gateway.GatewayError;
const logger            = common.logger;
var PerformanceEntity = require("itheon-module-performance-entity").PerformanceEntity;
var MetricEntity      = require("itheon-module-metric-entity").MetricEntity;
var DeviceEntity      = require("itheon-module-device-entity").DeviceEntity;


class RethinkDbPerformanceGateway extends RethinkDbGateway
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
     * Object describing performance's relation
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
   * @param PerformanceEntity performanceEntity Performance entity
   * @return Promise performance Promise of newly created performance entity
   */
  create(performanceEntity)
  {
    logger.info("RethinkDbPerformanceGateway::insert - performance received", {
      performanceEntity: performanceEntity
    });

    if (!(performanceEntity instanceof PerformanceEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of PerformanceEntity expected",
        {
          performanceEntity: performanceEntity
        },
        500
      );
    }

    return super.insert(performanceEntity)
      .then(function (performanceData) {
        return performanceData;
      });
  }

  /**
   * Method updates entity in table
   *
   * @param PerformanceEntity performanceEntity Performance entity
   * @return Promise performance Promise of newly created performance entity
   */
  update(performanceEntity)
  {
    if (!(performanceEntity instanceof PerformanceEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of Performance expected",
        {
          performanceEntity: performanceEntity
        },
        500
      );
    }

    return super.update(performanceEntity)
      .then(function (performanceData) {
        return performanceData;
      });
  }

  /**
   * Method replaces entity in table
   *
   * @param PerformanceEntity performanceEntity Performance entity
   * @return Promise performance Promise of newly created performance entity
   */
  replace(performanceEntity)
  {
    if (!(performanceEntity instanceof PerformanceEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of PerformanceEntity expected",
        {
          performanceEntity: performanceEntity
        }
      );
    }

    return super.replace(performanceEntity)
      .then(function (performanceData) {
        return performanceData;
      });
  }
}

module.exports = RethinkDbPerformanceGateway;
