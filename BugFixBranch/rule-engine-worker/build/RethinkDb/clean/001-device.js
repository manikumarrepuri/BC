
"use strict";

var r        = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();
const config = require("opserve-common").Config.get();
var replicas = config.get("rethinkdb:replicas");

module.exports = r.tableCreate("Device", {replicas: replicas}).then(function() {

  return r.table("Device")
    .indexCreate("deviceId", [r.row("name"), r.row("group")]).run();

}).then(function() {

  var devices = [
    {
      id: "Bluechip:Generic",
      name: "Generic",
      group: "Bluechip",
      displayName: "Generic Bluechip Machine",
      status: 1
    }
  ];

  return r.table("Device").insert(devices).run();

});
