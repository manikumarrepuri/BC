
"use strict";

const appRootPath         = require("app-root-path");
const Routes              = require("itheon-route");
const AclResourcesService = require(appRootPath + "/lib/module/Acl/lib/service/aclResourcesService");
const logger      = require("opserve-common").logger;

class AclResourceRoutes extends Routes
{
  constructor()
  {
    const aclResourcesService = new AclResourcesService();
    super(aclResourcesService, 'api/acl-resources');
  }
}

var apiRoutes = new AclResourceRoutes();
module.exports = apiRoutes;
