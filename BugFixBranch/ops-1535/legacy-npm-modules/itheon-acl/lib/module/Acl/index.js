
"use strict";

// export all services
module.exports.Services = {
  AclRulesService: require("./lib/service/aclRulesService")
};

// export all gateways
module.exports.Gateways = {
  RethinkDbAclRuleGateway: require("./lib/gateway/aclRule/rethinkDbAclRuleGateway")
};
