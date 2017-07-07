
"use strict";

const Routes          = require("itheon-route");
const AclRulesService = require("../service/aclRulesService");
const logger          = require("opserve-common").logger;

class AclRuleRoutes extends Routes
{
  constructor()
  {
    var aclRulesService = new AclRulesService();
    super(aclRulesService, 'api/acl-rules');
  }
}

var apiRoutes = new AclRuleRoutes();
module.exports = apiRoutes;
