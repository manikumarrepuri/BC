
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
      "color":  "#FFB06B" ,
      "id":  "5736dcb3-45c9-4d35-987b-58355d3c35b0" ,
      "name":  "software" ,
      "status": 1
    },
    {
      "color":  "#5AC594" ,
      "id":  "b8e855c7-68c7-4319-9932-08dac7b939fe" ,
      "name":  "user" ,
      "status": 1
    },
    {
      "color":  "#80B5D3" ,
      "id":  "505f2af1-6356-4d82-8bc3-43c85bd4f024" ,
      "name":  "system" ,
      "status": 1
    }
  ];

  return r.table("TagGroup").insert(tagGroups).run();
});
