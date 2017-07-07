
"use strict";

// export all routes
module.exports.Routes = {
  ApiRoutes: require('./lib/route/apiRoutes'),
};

// export all services
module.exports.Services = {
  RemindersService: require('./lib/service/remindersService')
};

// export all gateways
module.exports.Gateways = {
  HttpReminderGateway: require('./lib/gateway/reminder/httpReminderGateway')
};

// export all entities
module.exports.Entity = require("itheon-module-reminder-entity");
