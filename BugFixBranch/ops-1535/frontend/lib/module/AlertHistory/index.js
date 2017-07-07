
"use strict";

// export all routes
module.exports.Routes = {
  ApiRoutes: require('./lib/route/apiRoutes')
};

// export all services
module.exports.Services = {
  AlertHistorysService: require('./lib/service/alertHistorysService')
};

// export all gateways
module.exports.Gateways = {
  HttpAlertHistoryGateway: require('./lib/gateway/alertHistory/httpAlertHistoryGateway')
};

// export all entities
module.exports.Entity = require("itheon-module-alert-entity");
