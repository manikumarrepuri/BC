
"use strict";

// export all routes
module.exports.Routes = {
  ApiRoutes: require('./lib/route/apiRoutes'),
};

// export all services
module.exports.Services = {
  AgentUpdateService: require('./lib/service/agentRulesService')
};

// export all gateways
module.exports.Gateways = {
  HttpRuleGateway: require('./lib/gateway/agentRule/httpAgentRuleGateway')
};

// export all entities
//module.exports.Entity = require("itheon-module-agent-rule-entity");
