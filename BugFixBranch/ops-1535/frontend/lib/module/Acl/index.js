
"use strict";

// export all routes
module.exports.Routes = {
  AclApiRoutes: require('./lib/route/apiAclRoutes'),
  AclRuleApiRoutes: require('./lib/route/apiAclRuleRoutes'),
  AclRoleApiRoutes: require('./lib/route/apiAclRoleRoutes'),
  AclResourceApiRoutes: require('./lib/route/apiAclResourceRoutes')
};

// export all services
module.exports.Services = {
  AclService: require('./lib/service/aclService'),
  AclRulesService: require('./lib/service/aclRulesService'),
  AclRolesService: require('./lib/service/aclRolesService'),
  AclResourcesService: require('./lib/service/aclResourcesService')
};

// export all gateways
module.exports.Gateways = {
  HttpAclGateway: require('./lib/gateway/acl/httpAclGateway'),
  HttpAclRuleGateway: require('./lib/gateway/aclRule/httpAclRuleGateway'),
  HttpAclRoleGateway: require('./lib/gateway/aclRole/httpAclRoleGateway'),
  HttpAclResourceGateway: require('./lib/gateway/aclResource/httpAclResourceGateway'),
};

// export all entities
module.exports.Entity = require("itheon-module-acl-entity");
