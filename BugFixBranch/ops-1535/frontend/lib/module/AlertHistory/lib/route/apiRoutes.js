
"use strict";

const appRootPath           = require("app-root-path");
const Routes                = require("itheon-route");
const AlertHistorysService  = require(appRootPath + "/lib/module/AlertHistory/lib/service/alertHistorysService");
const logger                = require("opserve-common").logger;

class AlertHistoryRoutes extends Routes
{
  constructor()
  {
    var alertHistorysService = new AlertHistorysService();
    super(alertHistorysService, 'api/alert-histories');
  }
}

var apiRoutes = new AlertHistoryRoutes();
module.exports = apiRoutes;
