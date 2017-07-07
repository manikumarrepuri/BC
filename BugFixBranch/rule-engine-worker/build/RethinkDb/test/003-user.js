
"use strict";

var r        = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();
const config = require("opserve-common").Config.get();
var replicas = config.get("rethinkdb:replicas");

module.exports = r.tableCreate("User", {replicas: replicas}).then(function() {

  return r.table("User")
    .indexCreate("username").run();

}).then(function() {

  var users = [
    {
      "username": "admin",
      "email": "admin@bluechip.co.uk",
      "role": "admin",
      "title": "Site Admin",
      "status": 1,
      "password": "838d019062163e3c3e92a5d1bc3fc994de300ca9",
      "id": "1941aa46-7afb-48fb-ad0a-231b03c49cff"
    }
  ];

  return r.table("User").insert(users).run();

});
