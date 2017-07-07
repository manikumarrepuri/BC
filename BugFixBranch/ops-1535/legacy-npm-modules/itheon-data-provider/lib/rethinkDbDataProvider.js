
"use strict";

var config = require("itheon-config").ConfigFactory.getConfig();
var logger = require("itheon-logger");

class RethinkDbDataProvider
{
  getRethinkDbDataProvider()
  {
    if (!this.rethinkDb) {
      var rethinkDbConfig = config.get("rethinkdb");
      this.rethinkDb = require("rethinkdbdash")(rethinkDbConfig);
    }

    return this.rethinkDb;
  }
}

module.exports = new RethinkDbDataProvider();
