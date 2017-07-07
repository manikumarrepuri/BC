"use strict";

module.exports.aclService = require("./lib/acl");
module.exports.AclRulesService = require("./lib/module/Acl/service/aclRulesService");
module.exports.RethinkDbAclRuleGateway = require("./lib/module/Acl/gateway/aclRule/rethinkDbAclRuleGateway");
