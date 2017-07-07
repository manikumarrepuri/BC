
"use strict";

var appRootPath = require("app-root-path");
var r           = require(appRootPath + "/lib/dataProvider/rethinkDbDataProvider");

module.exports = function() {

  return r.table("User").delete().then(function () {

    var users = [
      {
        id: "8c20c084-e341-47bc-a5a5-cc0380a2a310",
        username: "JohnD",
        password: "f771230c21ff471a7744a507eaed10a6",
        email: "john.d@example.com",
        firstName: "John",
        middleName: "Smith",
        lastName: "Doe",
        avatar: "/public/avatarX.png",
        status:  "active",
        roleId: "40603aa2-5801-44c0-98b9-ab0be0987fcb",
        createdAt: new Date("1984-08-10T22:53:58.000Z"),
        updatedAt: new Date("1985-09-05T13:26:27.000Z")
      },
      {
        id: "3430e7f2-bb2a-4b36-97da-8454db63e877",
        username: "GeorgeC",
        password: "a3189f12904485b899c61aa46a23bd7b",
        email: "george.c@example.com",
        firstName: "George",
        middleName: "W",
        lastName: "Cent",
        avatar: "/public/avatarY.png",
        status:  "active",
        roleId: "096b009d-015c-4f23-b3ca-a49faae377d8",
        createdAt: new Date("1971-02-20T02:24:00.000Z"),
        updatedAt: new Date("1981-07-18T17:42:58.000Z")
      },
      {
        id: "9e766179-b515-4b91-a43c-b3ee1f7f43d8",
        username: "BobW",
        password: "f771230c21ff471a7744a507eaed10a6",
        email: "bob.w@example.com",
        firstName: "Bob",
        middleName: "H",
        lastName: "Storm",
        avatar: "/public/avatarZ.png",
        status:  "active",
        roleId: "096b009d-015c-4f23-b3ca-a49faae377d8",
        createdAt: new Date("2010-06-21T23:09:17.000Z"),
        updatedAt: new Date("2012-08-06T03:09:57.000Z")
      },
      {
        id: "543bca14-4da8-444f-921b-b3fe1dcfff65",
        username: "DaveA",
        password: "a3189f12904485b899c61aa46a23bd7b",
        email: "dave.a@example.com",
        firstName: "Dave",
        middleName: "D",
        lastName: "Axe",
        avatar: "/public/avatarA.png",
        status:  "active",
        roleId: "096b009d-015c-4f23-b3ca-a49faae377d8",
        createdAt: new Date("2000-10-14T02:44:36.000Z"),
        updatedAt: new Date("2006-12-22T10:21:14.000Z")
      }
    ];

    return r.table("User").insert(users).run();
  });
};
