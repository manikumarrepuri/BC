
"use strict";

var r        = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();
const config = require("opserve-common").Config.get();
var replicas = config.get("rethinkdb:replicas");

module.exports = r.tableCreate("Alert", {replicas: replicas}).then(function() {

  return r.table("Alert")
    .indexCreate("deviceId").run();

}).then(function() {

  var alerts = [
    {
      "deviceId": "AJ Bell::BCC-AJH-TC-03:BCC-AJH-TC-03",
      "entity": "",
      "ruleName": "cpu_load",
      "brief": "Some sort of problem happened.",
      "fullText": "Some sort of problem happened and more text would go here.",
      "occurrences": 1,
      "firstOccurrence": 1449229841,
      "lastOccurrence": 1449229841,
      "impact": 3,
      "urgency": 3,
      "resourceUrl": 3,
      "state": "N",
      "status": 1,
      "createdAt": "2015-12-04T09:24:43.238Z",
      "updatedAt": "2015-12-04T09:24:43.238Z"
    }
  ];

  return r.table("Alert").insert(alerts).run();

});
