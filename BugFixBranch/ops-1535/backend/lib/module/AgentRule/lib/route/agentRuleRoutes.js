
"use strict";

var BaseRoute         = require("itheon-route");
const common          = require("opserve-common");
const _               = common.utilities.underscore;
const ItheonError     = common.error.BaseError;
const logger          = common.logger;
var errorHandler      = common.error.errorHandler;
var AgentRulesService = require("./../service/agentRulesService");

class AgentRuleRoutes extends BaseRoute
{
  constructor()
  {
    var agentRulesService = new AgentRulesService();
    super(agentRulesService, 'api/agent-rules');
  }

  tagMatch(req, res)
  {
    logger.info(this.constructor.name + "::tagMatch - request received", {
      httpMethod: req.method,
      url: req.url,
      body: req.body,
      params: req.params
    });

    var that = this;

    try {
      this.setGateway(req);
      this.service.tagMatch.apply(this.service, [req.query])
        .then(function (collection) {
          res.set(that.createHeaders(collection.properties));
          return res.status(200).json(_.values(collection.export()));
        }, function (error) {
          logger.error('Exception was thrown - ' + error.message, {error: error});
          return errorHandler.resolve(error, req, res);
        })
        .catch(function (error) {
          logger.error('Error - ' + error.message, {error: error});
          return errorHandler.resolve(error, req, res);
        });
    } catch (error) {
      return errorHandler.resolve(error, req, res);
    }
  }
}

module.exports = new AgentRuleRoutes();
