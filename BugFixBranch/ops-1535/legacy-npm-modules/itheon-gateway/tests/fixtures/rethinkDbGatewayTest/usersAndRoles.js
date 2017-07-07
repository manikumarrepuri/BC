
"use strict";

var appRootPath = require("app-root-path");
var r           = require("itheon-data-provider").rethinkDbDataProvider.getRethinkDbDataProvider();

module.exports = function() {

  return r.table("User").delete().then(function() {

    var users = [
      {
        id: "b808972a-ec28-4d69-a194-d1e05c5ff0e8",
        username: "mina.hernadi",
        password: "6accdad680d6b4bdd7261e5ba71ffd9c3a8a3ec0",
        email: "mina.hernadi@hedonsoftware.com",
        firstName: "Mina",
        middleName: "D",
        lastName: "Hernadi",
        age: 15,
        avatar: "/static/images/avatars/04.png",
        status: "active",
        roleId: "6eeac08b-818b-480f-896f-8e4ea3f57267",
        createdAt: new Date("2015-08-22T22:24:15.000Z"),
        updatedAt: null
      },
      {
        id: "e37134f4-ef5c-4a3e-883d-7ed7e23dc294",
        username: "horgan.madore",
        password: "6accdad680d6b4bdd7261e5ba71ffd9c3a8a3ec0",
        email: "horgan.madore@hedonsoftware.com",
        firstName: "Horgan",
        middleName: "Fearnley",
        lastName: "Madore",
        age: 45,
        avatar: "/static/images/avatars/11.png",
        status: "active",
        roleId: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
        createdAt: new Date("2015-08-22T07:42:47.000Z"),
        updatedAt: null
      },
      {
        id: "d7885ec6-ece3-427a-b15c-c114d27d2f82",
        username: "jerrie.mcginnis",
        password: "6accdad680d6b4bdd7261e5ba71ffd9c3a8a3ec0",
        email: "jerrie.mcginnis@hedonsoftware.com",
        firstName: "Jerrie",
        middleName: null,
        lastName: "Mcginnis",
        age: 35,
        avatar: "/static/images/avatars/86.png",
        status: "active",
        roleId: "6eeac08b-818b-480f-896f-8e4ea3f57267",
        createdAt: new Date("2015-08-22T07:34:11.000Z"),
        updatedAt: null
      },
      {
        id: "8d28e55b-1e77-479f-a3f6-c499c40be3ea",
        username: "unknown",
        password: "",
        email: "",
        firstName: "Unknown",
        middleName: null,
        lastName: "Unknown",
        age: 30,
        avatar: "/static/images/avatars/00.png",
        status: "active",
        roleId: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
        createdAt: new Date("2015-08-22T04:23:12.000Z"),
        updatedAt: null
      },
      {
        id: "4c374646-ff38-4a8b-adf6-0bf0e3723c75",
        username: "kristy.daniel",
        password: "6accdad680d6b4bdd7261e5ba71ffd9c3a8a3ec0",
        email: "kristy.daniel@hedonsoftware.com",
        firstName: "Kristy",
        middleName: null,
        lastName: "Daniel",
        age: 40,
        avatar: "/static/images/avatars/35.png",
        status: "active",
        roleId: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
        createdAt: new Date("2015-08-22T05:34:12.000Z"),
        updatedAt: null
      }
    ];

    return r.table("User").insert(users).run();

  }).then(function() {

    return r.table("AclRole").delete();

  }).then(function() {

    var aclRoles = [
      {
        id: "6eeac08b-818b-480f-896f-8e4ea3f57267",
        name: "admin",
        description: "Application administrator",
        parent: null,
        status: "active",
        createdAt: new Date("2015-08-22T23:12:31.000Z"),
        updatedAt: null
      },
      {
        id: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
        name: "user",
        description: "Application user",
        parent: "d16db438-35a9-4dcc-946c-c2460aa7dda7",
        status: "active",
        createdAt: new Date("2015-08-22T12:17:02.000Z"),
        updatedAt: null
      }
    ];

    return r.table("AclRole").insert(aclRoles).run();
  });

};