
"use strict";

var appRootPath       = require("app-root-path");
var PerformanceEntity = require("itheon-module-performance-entity").PerformanceEntity;
const common          = require("opserve-common");
const _               = common.utilities.underscore;
const ItheonError     = common.error.BaseError;
const Request         = common.Request;

class PerformancesService
{
  constructor(performanceGateway, gatewayType)
  {
     this.setGateway(performanceGateway, gatewayType);
  }

  setGateway(performanceGateway, gatewayType)
  {
    if (!performanceGateway) {
      if (gatewayType === "default" || gatewayType === "db") {
        var PerformancesGateway = require("../gateway/performance/rethinkDbPerformanceGateway");
        performanceGateway = new PerformancesGateway();
      }
    }

    this.performanceGateway = performanceGateway;
  }

  /**
   * Method gets all performance matching passed query
   * @param  {[type]}   query    [description]
   * @return {[type]}            [description]
   */
  find(query)
  {
    query = query || new Request();
    return this.performanceGateway.fetchAll(query)
      .then(function (data) {
        if (_.isNumber(data)) {
          return data;
        }
        return data || [];
      });
  }

  /**
   * Method creates the passed data using gateway with inflated
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  create(data)
  {
    var performanceEntity = this.validateData(data);

    return this.performanceGateway.create(performanceEntity)
      .then(function (performanceData) {
        if(performanceData.errorCode) {
          throw new ItheonError(performanceData.message, performanceData.data, performanceData.errorCode);
        }

        return performanceData;
      });
  }

  /**
   * Method update the passed data using gateway with inflated
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  update(data)
  {
    var performanceEntity = this.validateData(data);

    return this.performanceGateway.update(performanceEntity)
      .then(function (performanceData) {
        if(performanceData.errorCode) {
          throw new ItheonError(performanceData.message, performanceData.data, performanceData.errorCode);
        }

        return performanceData;
      });
  }

  /**
   * Method delete the passed data using gateway with inflated
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  delete(id)
  {
    return this.performanceGateway.delete(id);
  }

  /**
   * Method checks data for create/update method
   *
   * @param object data Object with data
   */
  validateData(data)
  {
    if (!_.isObject(data)) {
      throw new ItheonError(
        "Invalid data provided. Object describing entity properties expected.",
        {
          data: data
        }
      );
    }

    return new PerformanceEntity(data);
  }
}

module.exports = PerformancesService;
