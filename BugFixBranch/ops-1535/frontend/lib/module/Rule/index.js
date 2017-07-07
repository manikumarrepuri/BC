
"use strict";

// export all routes
module.exports.Routes = {
  ApiRoutes: require('./lib/route/apiRoutes'),
};

// export all services
module.exports.Services = {
  RulesService: require('./lib/service/rulesService')
};

// export all gateways
module.exports.Gateways = {
  HttpRuleGateway: require('./lib/gateway/rule/httpRuleGateway')
};

// export all entities
module.exports.Entity = require("itheon-module-rule-entity");
