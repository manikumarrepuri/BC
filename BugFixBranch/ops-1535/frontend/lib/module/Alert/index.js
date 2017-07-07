
"use strict";

// export all routes
module.exports.Routes = {
  ApiRoutes: require('./lib/route/apiRoutes')
};

// export all services
module.exports.Services = {
  AlertsService: require('./lib/service/alertsService')
};

// export all gateways
module.exports.Gateways = {
  HttpAlertGateway: require('./lib/gateway/alert/httpAlertGateway')
};

// export all entities
module.exports.Entity = require("itheon-module-alert-entity");
