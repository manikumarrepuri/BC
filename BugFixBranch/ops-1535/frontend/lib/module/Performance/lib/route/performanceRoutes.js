
"use strict";

const appRootPath         = require("app-root-path");
const Routes              = require("itheon-route");
const PerformancesService = require(appRootPath + "/lib/module/Performance/lib/service/performancesService");
const logger              = require("opserve-common").logger;

class PerformanceRoutes extends Routes
{
  constructor()
  {
    var performancesService = new PerformancesService();
    super(performancesService, 'api/performances');
  }

  setGateway()
  {
    this.service.setGateway(null, null);
  }
}

var apiRoutes = new PerformanceRoutes();
module.exports = apiRoutes;
