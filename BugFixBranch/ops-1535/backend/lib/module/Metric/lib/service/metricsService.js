
"use strict";

var appRootPath  = require("app-root-path");
var MetricEntity = require("itheon-module-metric-entity").MetricEntity;
const common          = require("opserve-common");
const _               = common.utilities.underscore;
const ItheonError     = common.error.BaseError;
const Request         = common.Request;

class MetricsService
{
  constructor(metricGateway, gatewayType)
  {
     this.setGateway(metricGateway, gatewayType);
  }

  setGateway(metricGateway, gatewayType)
  {
    if (!metricGateway) {
      if (gatewayType === "default" || gatewayType === "db") {
        var MetricsGateway = require("../gateway/metric/rethinkDbMetricGateway");
        metricGateway = new MetricsGateway();
      }
    }

    this.metricGateway = metricGateway;
  }

  /**
   * Method gets all metric matching passed query
   * @param  {[type]}   query    [description]
   * @return {[type]}            [description]
   */
  find(query)
  {
    query = query || new Request();
    return this.metricGateway.fetchAll(query)
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
    var metricEntity = this.validateData(data);

    return this.metricGateway.create(metricEntity)
      .then(function (metricData) {
        if(metricData.errorCode) {
          throw new ItheonError(metricData.message, metricData.data, metricData.errorCode);
        }

        return new MetricEntity(metricData);
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
    var metricEntity = this.validateData(data);

    return this.metricGateway.update(metricEntity)
      .then(function (metricData) {
        if(metricData.errorCode) {
          throw new ItheonError(metricData.message, metricData.data, metricData.errorCode);
        }

        return new MetricEntity(metricData);
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
    return this.metricGateway.delete(id);
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

    return new MetricEntity(data);
  }
}

module.exports = MetricsService;
