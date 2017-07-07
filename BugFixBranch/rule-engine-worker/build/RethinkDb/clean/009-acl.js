"use strict";

var r = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();
const config = require("opserve-common").Config.get();
var replicas = config.get("rethinkdb:replicas");

module.exports = r.tableCreate("AclRole", {
  replicas: replicas
}).then(function() {

var aclRoles = [{
  "createdAt": new Date(),
  "description": "Access to Alerts page, Devices page and Rules pages only.",
  "id": "technical",
  "status": 1,
  "updatedAt": null
}, {
  "createdAt": new Date(),
  "description": "Access to Alerts page, Devices page and Reminders page only.",
  "id": "operator",
  "status": 1,
  "updatedAt": null
}, {
  "createdAt": new Date(),
  "description": " Access to all pages except Users page.",
  "id": "administrator",
  "status": 1,
  "updatedAt": null
}, {
  "createdAt": new Date(),
  "description": "Access to Alerts page and Devices page only.",
  "id": "non-technical",
  "status": 1,
  "updatedAt": null
}];

return r.table("AclRole").insert(aclRoles).run();
}).then(function() {
return r.tableCreate("AclRule", {
  replicas: replicas
}).run();
}).then(function() {
return r.table("AclRule").indexCreate("role-resource", [r.row("role"), r.row("resource")]).run();
}).then(function() {

var aclRules = [{
  "action": "view",
  "createdAt": new Date(),
  "resource": "Devices",
  "role": "operator",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Alerts",
  "role": "non-technical",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Agent Rules",
  "role": "technical",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Central Rules",
  "role": "technical",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Agent Rules",
  "role": "administrator",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Devices",
  "role": "non-technical",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Devices",
  "role": "technical",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Reminders",
  "role": "operator",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Alerts",
  "role": "administrator",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Alerts",
  "role": "operator",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Dashboard",
  "role": "administrator",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Alerts",
  "role": "technical",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Reminders",
  "role": "administrator",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Tags",
  "role": "administrator",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Devices",
  "role": "administrator",
  "type": "allow",
  "updatedAt": null
}, {
  "action": "view",
  "createdAt": new Date(),
  "resource": "Central Rules",
  "role": "administrator",
  "type": "allow",
  "updatedAt": null
}];
return r.table("AclRule").insert(aclRules).run();
}).then(function() {
  return r.tableCreate("AclResource", {
    replicas: replicas
  }).run();
}).then(function() {
  var aclResources = [{
    "actions": ["view", "create", "edit", "delete"],
    "id": "Tags",
    "status": 1
  }, {
    "actions": ["view", "create", "edit", "delete"],
    "id": "Agent Rules",
    "status": 1
  }, {
    "actions": ["view", "create", "edit", "delete"],
    "id": "Alerts",
    "status": 1
  }, {
    "actions": ["view", "create", "edit", "delete"],
    "id": "Central Rules",
    "status": 1
  }, {
    "actions": ["view", "create", "edit", "delete"],
    "id": "Dashboard",
    "status": 1
  }, {
    "actions": ["view", "create", "edit", "delete"],
    "id": "Devices",
    "status": 1
  }, {
    "actions": ["view", "create", "edit", "delete"],
    "id": "Reminders",
    "status": 1
  }, {
    "actions": ["view", "create", "edit", "delete"],
    "id": "Users",
    "status": 1
  }, {
    "actions": ["view", "create", "edit", "delete"],
    "id": "Roles",
    "status": 1
  }];
  return r.table("AclResource").insert(aclResources).run();
});
