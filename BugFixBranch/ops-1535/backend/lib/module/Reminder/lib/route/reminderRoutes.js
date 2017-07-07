
"use strict";

var BaseRoute   = require("itheon-route");
var RemindersService = require("./../service/remindersService");

class ReminderRoutes extends BaseRoute
{
  constructor()
  {
    var remindersService = new RemindersService();
    super(remindersService, 'api/reminders');
  }
}

module.exports = new ReminderRoutes();
