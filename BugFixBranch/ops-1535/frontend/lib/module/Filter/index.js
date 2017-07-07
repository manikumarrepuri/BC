
"use strict";

// export all routes
module.exports.Routes = {
  ApiRoutes: require('./lib/route/apiRoutes')
};

// export all services
module.exports.Services = {
  FilterService: require('./lib/service/filterService')
};

// export all gateways
module.exports.Gateways = {
  HttpFilterGateway: require('./lib/gateway/filter/httpFilterGateway')
};
