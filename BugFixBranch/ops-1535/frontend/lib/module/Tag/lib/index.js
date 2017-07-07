
"use strict";

// export all routes
module.exports.Routes = {
  ApiRoutes: require('./lib/route/apiRoutes')
};

// export all services
module.exports.Services = {
  TagService: require('./lib/service/usersService')
};

// export all gateways
module.exports.Gateways = {
  HttpTagGateway: require('./lib/gateway/tag/httpTagGateway')
};

// export all entities
module.exports.Entities = require("itheon-module-tag-entity");
