
"use strict";

// export all routes
module.exports.Routes = {
  ApiRoutes: require('./lib/route/apiRoutes'),
};

// export all services
module.exports.Services = {
  ScheduledRemindersService: require('./lib/service/scheduledRemindersService')
};

// export all gateways
module.exports.Gateways = {
  HttpScheduledReminderGateway: require('./lib/gateway/scheduledReminder/httpScheduledReminderGateway')
};

// export all entities
module.exports.Entity = require("itheon-module-reminder-entity");
