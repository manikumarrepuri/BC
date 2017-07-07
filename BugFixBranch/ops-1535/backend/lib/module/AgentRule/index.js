
"use strict";

// export all routes
module.exports.Routes = {
  AgentRuleRoutes: require("./lib/route/agentRuleRoutes")
};

// export all services
module.exports.Services = {
  AgentRulesService: require("./lib/service/agentRulesService")
};

// export all gateways
module.exports.Gateways = {
  RethinkDbAgentRuleGateway: require("./lib/gateway/agentRule/rethinkDbAgentRuleGateway")
};

// export all entities
module.exports.Entities = require("itheon-module-agent-rule-entity");
