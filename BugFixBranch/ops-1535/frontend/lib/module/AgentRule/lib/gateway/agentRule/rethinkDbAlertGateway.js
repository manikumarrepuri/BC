
"use strict";

const appRootPath      = require("app-root-path");
const common            = require("opserve-common");
const RethinkDbGateway  = common.gateway.RethinkDbGateway;
const _                 = common.utilities.underscore;
const GatewayError      = common.gateway.GatewayError;
const logger            = common.logger;
const AgentRuleEntity  = require("itheon-module-agent-rule-entity").AgentRuleEntity;

class RethinkDbAgentRuleGateway extends RethinkDbGateway
{
  /**
   * Cutom contractor allows to pass instance of data provider
   *
   * @param object dataProvider Data provider(i.e. dbConnection)
   */
  constructor(dataProvider)
  {
    super(dataProvider);

    this.table = {
      "name": "AgentRule",
      "alias": "a"
    };

    /**
     * Object describing agent rule relation
     *
     * @type Object
     */
    this.relations = {};
  }

  subscribeToAlertChanges(socket)
  {
    this.dataProvider.table('AgentRule')
      .changes().run().then(function(feed) {
        feed.each(function(err, change) {
          if (err) {
            logger.error(err.toString());
            logger.error(err.stack);
            return;
          }

          logger.info('AngetRule change received', change);
          socket.emit('agentRuleUpdate', change);
      });
    }).error(function(err) {
      logger.error(err);
    });
  }

}

module.exports = RethinkDbAgentRuleGateway;
