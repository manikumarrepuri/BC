
"use strict";

var appRootPath          = require("app-root-path");
var HttpGateway          = require("../../lib/httpGateway");
var UserEntity           = require("./userEntity");
var UserCollectionEntity = require("./userCollectionEntity");
var ItheonError          = require("itheon-error").BaseError;
var _                    = require("itheon-utility").underscore;
var Request              = require("itheon-request");
var config               = require("itheon-config").ConfigFactory.getConfig();

class HttpUserGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/users";
  }
}

module.exports = HttpUserGateway;
