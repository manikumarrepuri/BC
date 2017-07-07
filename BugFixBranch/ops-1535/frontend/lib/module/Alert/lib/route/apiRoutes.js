
"use strict";

const appRootPath   = require("app-root-path");
const Routes        = require("itheon-route");
const AlertsService = require(appRootPath + "/lib/module/Alert/lib/service/alertsService");
const logger        = require("opserve-common").logger;

class AlertRoutes extends Routes
{
  constructor()
  {
    var alertsService = new AlertsService();
    super(alertsService, 'api/alerts');
  }
}

var apiRoutes = new AlertRoutes();
module.exports = apiRoutes;
