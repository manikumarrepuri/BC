
"use strict";

const appRootPath       = require("app-root-path");
const Routes            = require("itheon-route");
const RemindersService  = require(appRootPath + "/lib/module/Reminder/lib/service/remindersService");
const logger            = require("opserve-common").logger;

class ReminderRoutes extends Routes
{
  constructor()
  {
    var remindersService = new RemindersService();
    super(remindersService, 'api/reminders');
  }
}

var apiRoutes = new ReminderRoutes();
module.exports = apiRoutes;
