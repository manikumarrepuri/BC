
"use strict";

var appRoot          = require("app-root-path");
var RethinkdbGateway = require(appRoot + "/lib/gateway/rethinkdbGateway");

/**
 * Sample gateway class definition
 */
class SampleGateway extends RethinkdbGateway
{
  /**
   * Cutom contractor allows to inject instance of data provider
   *
   * @param object dataProvider Gateway's data provider(i.e. dbConnection)
   */
  constructor(dataProvider)
  {
    super(dataProvider);

    this.table = {
      "name": "Sample",
      "alias": "s"
    };

    this.relations = {
      "owner": {
        "table": "User",
        "localColumn": "ownerId",
        "targetColumn": "id",
        "defaultAlias": "u"
      },
      "ticket": {
        "table": "Ticket",
        "localColumn": "ticketId",
        "targetColumn": "id",
        "defaultAlias": "t"
      }
    };
  }
}

module.exports = SampleGateway;
