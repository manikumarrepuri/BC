
"use strict";

var BaseRoute   = require("itheon-route");
var ScheduledRemindersService = require("./../service/scheduledRemindersService");

class ScheduledReminderRoutes extends BaseRoute
{
  constructor()
  {
    var scheduledRemindersService = new ScheduledRemindersService();
    super(scheduledRemindersService, 'api/scheduledReminders');
  }
}

module.exports = new ScheduledReminderRoutes();
