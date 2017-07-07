"use strict";

const appRootPath               = require("app-root-path");
const Routes                    = require("itheon-route");
const ScheduledRemindersService = require(appRootPath + "/lib/module/ScheduledReminder/lib/service/scheduledRemindersService");
const logger                    = require("opserve-common").logger;

class ScheduledReminderRoutes extends Routes
{
  constructor()
  {
    var scheduledRemindersService = new ScheduledRemindersService();
    super(scheduledRemindersService, 'api/scheduled-reminders');
  }
}

var apiRoutes = new ScheduledReminderRoutes();
module.exports = apiRoutes;
