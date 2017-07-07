
"use strict";

var r        = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();
var config   = require("itheon-config").ConfigFactory.getConfig();
var replicas = config.get("rethinkdb:replicas");

module.exports = function() {

  return r.table("User").delete().run()
    .then(function() {

      var users = [
        {
          "email": "admin@bluechip.co.uk",
          "id":  "1941aa46-7afb-48fb-ad0a-231b03c49cff",
          "password":  "838d019062163e3c3e92a5d1bc3fc994de300ca9",
          "roles": [
            "admin"
          ],
          "status": 1,
          "title":  "Site Admin",
          "username":  "admin"
        },
        {
          "email": "joed@bluechip.co.uk",
          "id":  "e2c8de86-29bc-4da9-9a3d-dc5249a4aaa2",
          "password":  "838d019062163e3c3e92a5d1bc3fc994de300ca9",
          "roles": [
            "admin",
            "operator"
          ] ,
          "status": 1,
          "title":  "Joe D",
          "username":  "joed"
        }
      ];

      return r.table("User").insert(users).run();

    }).then(function() {

      return r.table("AclRule").delete().run();

    }).then(function() {

      var aclRules = [
        {
          "action":  "view",
          "id":  "159d61a4-9ed9-4fb1-9e82-b464d8191839",
          "resource":  "devicesPage",
          "role":  "operator",
          "status": 1,
          "type":  "allow"
        },
        {
          "action":  "view",
          "id":  "1a70c107-6e58-471a-a577-052eca4c6656",
          "resource":  "usersPage",
          "role":  "operator",
          "status": 1,
          "type":  "allow"
        },
        {
          "action":  "view",
          "id":  "3270c107-6e58-1234-1234-052eca4c3322",
          "resource":  "otherPage",
          "role":  "admin",
          "status": 1,
          "type":  "allow"
        },
        {
          "action":  "view",
          "id":  "3270c107-6e58-1234-1234-052eca4c3322",
          "resource":  "otherPage2",
          "role":  "superAdmin",
          "status": 1,
          "type":  "allow"
        },
        {
          "action":  "login",
          "id":  "d7d01350-53c0-4601-9f4d-5f1c01166561",
          "resource":  "loginPage",
          "role":  "guest",
          "status": 1,
          "type":  "allow"
        }
      ];

      return r.table("AclRule").insert(aclRules).run();

    });
};
