
"use strict";

const common            = require("opserve-common");
const HttpGateway       = common.gateway.HttpGateway;
const config            = common.Config.get();
const ItheonError       = common.error.BaseError;
var MetricEntity = require("itheon-module-metric-entity").MetricEntity;

class HttpMetricGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/metrics";
  }

  create(metricEntity)
  {
    if (!(metricEntity instanceof MetricEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of MetricEntity expected");
    }

    return super.insert(metricEntity)
      .then(function(metricData) {
        return new MetricEntity(metricData);
      });
  }

  update(metric)
  {
    if (!(metric instanceof MetricEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of MetricEntity expected");
    }

    if (!metric.getId()) {
      throw new ItheonError("Invalid logic. Insert should be called");
    }

    return super.update(metric)
      .then(function(metricData) {
        return new MetricEntity(metricData);
      });
  }
}

module.exports = HttpMetricGateway;
