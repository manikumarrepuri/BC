
"use strict";

var TagEntity        = require("itheon-module-tag-entity").TagEntity;
var common           = require('opserve-common');
var _                = common.utilities.underscore;
const logger         = common.logger;
const GatewayError     = common.gateway.GatewayError;
const RethinkDbGateway = common.gateway.RethinkDbGateway;

class TagRethinkDbGateway extends RethinkDbGateway
{
  /**
   * Custom constructor sets table name and alias and
   * allows to pass custom data provider
   */
  constructor(dataProvider)
  {
    super(dataProvider);

    this.table = {
      name: "Tag",
      alias: "t"
    };

    /**
     * Object describing device's relation
     *
     * @type Object
     */
    this.relations = {};
  }

  /**
   * Method stores device in Redis
   *
   * @param object device
   */
  save(tags)
  {
    logger.info(
      "TagRethinkDbGateway: Saving tags in RethinkDb"
    );

    return this.insert(tags)
      .then(function() {
        return tags;
      });
  }
}

module.exports = TagRethinkDbGateway;
