
"use strict";

const appRootPath           = require("app-root-path");
const Routes                = require("itheon-route");
const FilterService         = require(appRootPath + "/lib/module/Filter/lib/service/filterService");
const logger                = require("opserve-common").logger;

class FilterRoutes extends Routes
{
  constructor()
  {
    var filterService = new FilterService();
    super(filterService, 'api/filters');
  }
}

var apiRoutes = new FilterRoutes();
module.exports = apiRoutes;
