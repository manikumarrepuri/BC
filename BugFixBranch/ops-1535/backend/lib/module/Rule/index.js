
"use strict";

// export all routes
module.exports.Routes = {
  RuleRoutes: require("./lib/route/ruleRoutes")
};

// export all services
module.exports.Services = {
  RulesService: require("./lib/service/rulesService")
};

// export all gateways
module.exports.Gateways = {
  RethinkDbRuleGateway: require("./lib/gateway/rule/rethinkDbRuleGateway")
};

// export all entities
module.exports.Entities = require("itheon-module-rule-entity");
