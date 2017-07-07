
"use strict";

const appRootPath   = require("app-root-path");
const Routes        = require("itheon-route");
const RulesService  = require(appRootPath + "/lib/module/Rule/lib/service/rulesService");
const logger        = require("opserve-common").logger;

class RuleRoutes extends Routes
{
  constructor()
  {
    var rulesService = new RulesService();
    super(rulesService, 'api/rules');
  }

  updateThresholds(req, res)
  {
    logger.info(req.method + ' request: ' + req.url);

    req.body.id = parseInt(req.params.id, 10);

    var rulesService = new RulesService();
    rulesService.updateThresholds(req.body)
      .then(function (rule) {
        if (rule === null) {
          return res.status(409).json('Conflict');
        }
        return res.status(200).json(rule);
      }, function (result) {
        logger.error('Exception was thrown - ' + result.message, result);
        return res.status(500).json('Internal Server Error');
      })
      .catch(function (error) {
        logger.error('Error - ' + error);
        return res.status(500).json('Internal Server Error');
      });
  }
}

var apiRoutes = new RuleRoutes();
module.exports = apiRoutes;
