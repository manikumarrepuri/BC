
"use strict";

const appRootPath     = require("app-root-path");
const Routes          = require("itheon-route");
const DevicesService  = require(appRootPath + "/lib/module/Device/lib/service/devicesService");
const logger          = require("opserve-common").logger;

class DeviceRoutes extends Routes
{
  constructor()
  {
    var devicesService = new DevicesService();
    super(devicesService, 'api/devices');
  }
}

var apiRoutes = new DeviceRoutes();
module.exports = apiRoutes;
