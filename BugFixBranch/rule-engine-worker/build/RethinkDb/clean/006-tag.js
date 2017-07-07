
"use strict";

var r        = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();
const config = require("opserve-common").Config.get();
var replicas = config.get("rethinkdb:replicas");

module.exports = r.tableCreate("Tag", {replicas: replicas}).then(function() {
  return r.table("Tag")
    .indexCreate("name").run();
}).then(function() {
  return r.table("Tag")
    .indexCreate("status").run();
}).then(function() {
  var date = new Date();
  var tags = [
    {
      id: "system:platform:os400",
      group: "system",
      type: "platform",
      value: "os400",
      description: "os400 systems",
      color: null,
      defaultColor: "#80B5D3",
      createdAt: date,
      status: 1,
      weight: 1000
    },
    {
      id: "system:platform:windows",
      group: "system",
      type: "platform",
      value: "windows",
      description: "windows systems",
      color: null,
      defaultColor: "#80B5D3",
      createdAt: date,
      status: 1,
      weight: 1000
    },
    {
      id: "system:platform:linux",
      group: "system",
      type: "platform",
      value: "linux",
      description: "linux systems",
      color: null,
      defaultColor: "#80B5D3",
      createdAt: date,
      status: 1,
      weight: 1000
    },
    {
      id: "system:sourceType:iAM Agent",
      group: "system",
      type: "sourceType",
      value: "iAM Agent",
      description: "Metrics collected by iAM Agent",
      color: null,
      defaultColor: "#80B5D3",
      createdAt: date,
      status: 1,
      weight: 1000
    }
  ];

  return r.table("Tag").insert(tags).run();
});
