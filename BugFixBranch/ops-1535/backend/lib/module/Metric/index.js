
"use strict";

// export all routes
module.exports.Routes = {
  MetricRoutes: require("./lib/route/metricRoutes")
};

// export all services
module.exports.Services = {
  MetricsService: require("./lib/service/metricsService")
};

// export all gateways
module.exports.Gateways = {
  RethinkDbMetricGateway: require("./lib/gateway/metric/rethinkDbMetricGateway")
};

// export all entities
module.exports.Entities = require("itheon-module-metric-entity");
