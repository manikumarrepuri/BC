
"use strict";

// export all routes
module.exports.Routes = {
  ApiRoutes: require('./lib/route/apiRoutes'),
};

// export all services
module.exports.Services = {
  DevicesService: require('./lib/service/devicesService')
};

// export all gateways
module.exports.Gateways = {
  HttpDeviceGateway: require('./lib/gateway/device/httpDeviceGateway')
};

// export all entities
module.exports.Entity = require("itheon-module-device-entity");
