
"use strict";

var BaseRoute    = require("itheon-route");
var RulesService = require("./../service/rulesService");

class RuleRoutes extends BaseRoute
{
  constructor()
  {
    var rulesService = new RulesService();
    super(rulesService, 'api/rules');
  }
}

module.exports = new RuleRoutes();
