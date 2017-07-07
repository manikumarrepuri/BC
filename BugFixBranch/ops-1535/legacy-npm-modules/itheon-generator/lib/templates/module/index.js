
"use strict";

// export all routes
module.exports.Routes = {
  ApiRoutes: require('./lib/route/apiRoutes'),
};

// export all services
module.exports.Services = {
  {{Module}}sService: require('./lib/service/{{module}}sService')
};

// export all gateways
module.exports.Gateways = {
  Http{{Module}}Gateway: require('./lib/gateway/device/http{{Module}}Gateway')
  RethinkDb{{Module}}Gateway: require('./lib/gateway/device/rethinkDb{{Module}}Gateway')
};

// export all entities
module.exports.Entity = require("itheon-module-{{module}}-entity");
