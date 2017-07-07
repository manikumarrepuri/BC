
"use strict";

// export all routes
module.exports.Routes = {
  AclRoutes: require("./lib/route/aclRoutes"),
  AclRuleRoutes: require("./lib/route/aclRuleRoutes"),
  AclRoleRoutes: require("./lib/route/aclRoleRoutes"),
  AclResourceRoutes: require("./lib/route/aclResourceRoutes")
};

// export all services
module.exports.Services = {
  AclRulesService: require("itheon-acl").AclRulesService,
  AclRolesService: require("./lib/service/aclRolesService"),
  AclResourcesService: require("./lib/service/aclResourcesService")
};

// export all gateways
module.exports.Gateways = {
  RethinkDbAclRuleGateway: require("itheon-acl").RethinkDbAclRuleGateway,
  RethinkDbAclRoleGateway: require("./lib/gateway/aclRole/rethinkDbAclRoleGateway"),
  RethinkDbAclResourceGateway: require("./lib/gateway/aclResource/rethinkDbAclResourceGateway")
};

// export all entities
module.exports.Entities = require("itheon-module-acl-entity");
