
"use strict";

const Routes          = require("itheon-route");
const AclRolesService = require("../service/aclRolesService");
const logger          = require("opserve-common").logger;

class AclRoleRoutes extends Routes
{
  constructor()
  {
    var aclRolesService = new AclRolesService();
    super(aclRolesService, 'api/acl-roles');
  }
}

var apiRoutes = new AclRoleRoutes();
module.exports = apiRoutes;
