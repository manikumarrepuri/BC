
"use strict";

var BaseRoute       = require("itheon-route");
var AclRulesService = require("itheon-acl").AclRulesService;

class AclRuleRoutes extends BaseRoute
{
  constructor()
  {
    var aclRulesService = new AclRulesService();
    super(aclRulesService, 'api/acl-rules');
  }
}

module.exports = new AclRuleRoutes();
