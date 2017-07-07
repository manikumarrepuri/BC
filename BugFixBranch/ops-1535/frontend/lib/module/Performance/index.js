
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
  HttpPerformanceGateway: require('./lib/gateway/performance/httpPerformanceGateway')
};

// export all entities
module.exports.Entity = require("itheon-module-performance-entity");

