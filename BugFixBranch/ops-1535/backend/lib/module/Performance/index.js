
"use strict";

// export all routes
module.exports.Routes = {
  PerformanceRoutes: require("./lib/route/performanceRoutes")
};

// export all services
module.exports.Services = {
  PerformancesService: require("./lib/service/performancesService")
};

// export all gateways
module.exports.Gateways = {
  RethinkDbPerformanceGateway: require("./lib/gateway/performance/rethinkDbPerformanceGateway")
};

// export all entities
module.exports.Entities = require("itheon-module-performance-entity");
