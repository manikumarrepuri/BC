
"use strict";

var r        = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();
const config = require("opserve-common").Config.get();
var replicas = config.get("rethinkdb:replicas");

module.exports = r.tableCreate("Alert", {replicas: replicas}).then(function() {
  return r.table("Alert")
    .indexCreate("deviceId").run();
  })
  .then(function() {
    return r.table("Alert").indexCreate("createdAt").run();
  })
  .then(function() {
    return r.tableCreate("AlertHistory", {replicas: replicas}).run();
  }).then(function() {
    return r.table("AlertHistory").indexCreate("deviceId").run();
  })
  .then(function() {
    return r.table("AlertHistory").indexCreate("createdAt").run();
  });
