
"use strict";

// export all routes
module.exports.Routes = {
  ScheduledReminderRoutes: require("./lib/route/scheduledReminderRoutes")
};

// export all services
module.exports.Services = {
  ScheduledRemindersService: require("./lib/service/scheduledRemindersService")
};

// export all gateways
module.exports.Gateways = {
  RethinkDbScheduledReminderGateway: require("./lib/gateway/scheduledReminder/rethinkDbScheduledReminderGateway")
};

// export all entities
module.exports.Entities = require("itheon-module-reminder-entity");
