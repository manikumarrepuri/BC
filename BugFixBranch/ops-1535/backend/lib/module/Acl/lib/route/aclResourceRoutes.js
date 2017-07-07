
"use strict";

var BaseRoute           = require("itheon-route");
var AclResourcesService = require("./../service/aclResourcesService");

class AclResourceRoutes extends BaseRoute
{
  constructor()
  {
    var aclResourcesService = new AclResourcesService();
    super(aclResourcesService, 'api/acl-resources');
  }
}

module.exports = new AclResourceRoutes();
