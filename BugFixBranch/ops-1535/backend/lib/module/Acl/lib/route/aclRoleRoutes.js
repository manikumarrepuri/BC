
"use strict";

var BaseRoute       = require("itheon-route");
var AclRolesService = require("./../service/aclRolesService");

class AclRoleRoutes extends BaseRoute
{
  constructor()
  {
    var aclRolesService = new AclRolesService();
    super(aclRolesService, 'api/acl-roles');
  }
}

module.exports = new AclRoleRoutes();
