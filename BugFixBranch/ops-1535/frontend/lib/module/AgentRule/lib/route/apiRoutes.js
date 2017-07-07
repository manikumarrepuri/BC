
"use strict";

const appRootPath       = require("app-root-path");
const Routes            = require("itheon-route");
const AgentRulesService = require(appRootPath + "/lib/module/AgentRule/lib/service/agentRulesService");
const common            = require("opserve-common");
const _                 = common.utilities.underscore;
const logger            = common.logger;
const errorHandler      = common.error.errorHandler

class AgentRuleRoutes extends Routes
{
  constructor()
  {
    var rulesService = new AgentRulesService();
    super(rulesService, 'agent-update');
  }

  agentUpdate(req, res)
  {
    logger.info(this.constructor.name + "::agentUpdate - request received", {
      httpMethod: req.method,
      url: req.url,
      body: req.body,
      params: req.params
    });

    var that = this;
    var nestedArguments = this.generateTags(req);

    try {
      this.setGateway(req);
      this.service.agentUpdate.apply(this.service, nestedArguments)
        .then(function (list) {
          return res.status(200).send(list);
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

  processUpdate(req, res)
  {
    logger.info(this.constructor.name + "::processUpdate - request received", {
      httpMethod: req.method,
      url: req.url,
      body: req.body,
      params: req.params
    });

    var that = this;
    var nestedArguments = this.getNestedArguments(req);
    nestedArguments.push(req.body);

    try {
      this.setGateway(req);
      this.service.processUpdate.apply(this.service, nestedArguments)
        .then(function (list) {
          return res.status(200).send(list);
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

  getRule(req, res)
  {
    var Zip = require("node-zip");
    var fileName = (!req.params.filename.endsWith(".zip")) ? req.params.filename : req.params.filename.substring(0, req.params.filename.length-4);
    var zip = new Zip;

    var that = this;
    var nestedArguments = this.generateTags(req);
    nestedArguments[0].appendConditions({"name": fileName});

    try {
      this.setGateway(req);
      this.service.getLatestAgentRule.apply(this.service, nestedArguments)
        .then(function (rule) {
          zip.file(fileName + ".rul", rule.content);
          var data = zip.generate({base64: false, compression: 'DEFLATE'});

          res.writeHead(200, {
            "Content-Type": "application/zip",
            "Content-disposition": "attachment;filename=" + fileName + ".zip",
            "Content-Length": data.length
          });
          return res.end(new Buffer(data, "binary"));
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

  generateTags(req)
  {
    //Create tag keys from request
    var tags = req.params.server.split("::");
    tags[0] = 'system:customer:' + tags[0];
    tags[1] = 'system:host:' + tags[1];

    //Generate query
    return [req.query.appendConditions({
      "tags": [
          tags[0],
          tags[1]
        ]
    })];
  }
}

var apiRoutes = new AgentRuleRoutes();
module.exports = apiRoutes;
