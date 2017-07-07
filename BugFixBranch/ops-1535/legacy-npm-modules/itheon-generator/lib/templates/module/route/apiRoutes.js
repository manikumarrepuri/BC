
"use strict";

var appRootPath         = require("app-root-path");
var Routes              = require("itheon-route");
var {{Module}}sService  = require(appRootPath + "/lib/module/{{Module}}/lib/service/{{module}}sService");
var logger              = require("itheon-logger");

class {{Module}}Routes extends Routes
{
  constructor()
  {
    var {{module}}sService = new {{Module}}sService();
    super({{module}}sService, 'api/{{module}}s');
  }
}

var apiRoutes = new {{Module}}Routes();
module.exports = apiRoutes;
