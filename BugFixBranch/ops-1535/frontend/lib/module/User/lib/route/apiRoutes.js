
"use strict";

const appRootPath  = require("app-root-path");
const Routes       = require("itheon-route");
const UsersService = require("../service/usersService");
const sha1Crypt    = require('sha1');
const common       = require("opserve-common");
const logger       = common.logger;
const errorHandler = common.error.errorHandler;

class UserRoutes extends Routes
{
  constructor()
  {
    var usersService = new UsersService();
    super(usersService, 'api/users');
  }

  create(req, res)
  {
    logger.info(req.method + ' request: ' + req.url);

    // salting password
    var passwordSalt = '1244sdklf^&*$#@hasdjkl35345346533!!$%^&*$#@';
    req.body.password = sha1Crypt(req.body.password + passwordSalt);

    super.create(req, res);
  }
}

var apiRoutes = new UserRoutes();
module.exports = apiRoutes;
