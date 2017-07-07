
"use strict";

// export all routes
module.exports.Routes = {
  ReminderRoutes: require("./lib/route/reminderRoutes")
};

// export all services
module.exports.Services = {
  RemindersService: require("./lib/service/remindersService")
};

// export all gateways
module.exports.Gateways = {
  RethinkDbReminderGateway: require("./lib/gateway/reminder/rethinkDbReminderGateway")
};

// export all entities
module.exports.Entities = require("itheon-module-reminder-entity");
