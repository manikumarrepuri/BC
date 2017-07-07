
"use strict";

var r        = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();
const config = require("opserve-common").Config.get();
var replicas = config.get("rethinkdb:replicas");

module.exports = r.tableCreate("AgentRule", {replicas: replicas}).then(function() {
  return r.table("AgentRule")
    .indexCreate("agentRuleId").run();
});
