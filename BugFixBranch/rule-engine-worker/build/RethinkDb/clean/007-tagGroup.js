
"use strict";

var r        = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();
const config = require("opserve-common").Config.get();
var replicas = config.get("rethinkdb:replicas");

module.exports = r.tableCreate("TagGroup", {replicas: replicas}).then(function() {
  return r.table("TagGroup")
    .indexCreate("name").run();
}).then(function() {
  return r.table("TagGroup")
    .indexCreate("status").run();
}).then(function() {
  var tagGroups = [
    {
      name: "system",
      color: "#80B5D3",
      status: 1
    },
    {
      name: "software",
      color: "#FFB06B",
      status: 1
    },
    {
      name: "user",
      color: "#5AC594",
      status: 1
    }
  ];

  return r.table("TagGroup").insert(tagGroups).run();
});
