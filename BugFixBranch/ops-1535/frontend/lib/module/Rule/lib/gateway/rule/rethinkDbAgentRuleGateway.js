
"use strict";

const appRootPath      = require("app-root-path");
const common            = require("opserve-common");
const RethinkDbGateway  = common.gateway.RethinkDbGateway;
const _                 = common.utilities.underscore;
const GatewayError      = common.gateway.GatewayError;
const logger            = common.logger;
const RuleEntity       = require("itheon-module-agent-rule-entity").RuleEntity;

class RethinkDbRuleGateway extends RethinkDbGateway
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
      "name": "Rule",
      "alias": "r"
    };

    /**
     * Object describing agent rule relation
     *
     * @type Object
     */
    this.relations = {};
  }

  subscribeToRuleChanges(socket)
  {
    this.dataProvider.table('Rule')
      .changes().run().then(function(feed) {
        feed.each(function(err, change) {
          if (err) {
            logger.error(err.toString());
            logger.error(err.stack);
            return;
          }

          logger.info('Rule change received', change);
          socket.emit('ruleUpdate', change);
      });
    }).error(function(err) {
      logger.error(err);
    });
  }
}

module.exports = RethinkDbRuleGateway;
