
"use strict";

// export all routes
module.exports.Routes = {
  ApiRoutes: require('./lib/route/apiRoutes'),
  FrontendRoutes: require('./lib/route/frontendRoutes')
};

// export all services
module.exports.Services = {
  UsersService: require('./lib/service/usersService')
};

// export all gateways
module.exports.Gateways = {
  HttpUserGateway: require('./lib/gateway/user/httpUserGateway')
};

// export all entities
module.exports.Entity = require("itheon-module-user-entity");
