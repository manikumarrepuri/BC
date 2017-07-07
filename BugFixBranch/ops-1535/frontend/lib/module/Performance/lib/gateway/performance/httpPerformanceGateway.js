
"use strict";

const common            = require("opserve-common");
const _                 = common.utilities.underscore;
const HttpGateway       = common.gateway.HttpGateway;
const config            = common.Config.get();
const ItheonError       = common.error.BaseError;

class HttpPerformanceGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/performances";
  }

  create(performance)
  {
    if (!_.isObject(performance)) {
      throw new ItheonError("Invalid entity passed.Object expected");
    }

    return super.insert(performance)
      .then(function(performanceData) {
        return performanceData;
      });
  }

  update(performance)
  {
    if (!_.isObject(performance)) {
      throw new ItheonError("Invalid entity passed.Object expected");
    }

    if (!performance.id) {
      throw new ItheonError("Invalid logic. Insert should be called");
    }

    return super.update(performance)
      .then(function(performanceData) {
        return performanceData;
      });
  }
}

module.exports = HttpPerformanceGateway;
