
"use strict";

var BaseRoute   = require("itheon-route");
var PerformancesService = require("./../service/performancesService");

class PerformanceRoutes extends BaseRoute
{
  constructor()
  {
    var performancesService = new PerformancesService();
    super(performancesService, 'api/performances');
  }
}

module.exports = new PerformanceRoutes();
