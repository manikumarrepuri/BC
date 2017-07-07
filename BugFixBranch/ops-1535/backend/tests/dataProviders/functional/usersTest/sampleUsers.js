
"use strict";

let user1 = {
  id: "8c20c084-e341-47bc-a5a5-cc0380a2a310",
  username: "JohnD",
  password: "f771230c21ff471a7744a507eaed10a6",
  email: "john.d@example.com",
  firstName: "John",
  middleName: "Smith",
  lastName: "Doe",
  avatar: "/public/avatarX.png",
  status: "active",
  roleId: "40603aa2-5801-44c0-98b9-ab0be0987fcb",
  createdAt: "1984-08-10T22:53:58.000Z",
  updatedAt: "1985-09-05T13:26:27.000Z"
};

let user2 = {
  id: "3430e7f2-bb2a-4b36-97da-8454db63e877",
  username: "GeorgeC",
  password: "a3189f12904485b899c61aa46a23bd7b",
  email: "george.c@example.com",
  firstName: "George",
  middleName: "W",
  lastName: "Cent",
  avatar: "/public/avatarY.png",
  status: "active",
  roleId: "096b009d-015c-4f23-b3ca-a49faae377d8",
  createdAt: "1971-02-20T02:24:00.000Z",
  updatedAt: "1981-07-18T17:42:58.000Z"
};

let user3 = {
  id: "9e766179-b515-4b91-a43c-b3ee1f7f43d8",
  username: "BobW",
  password: "f771230c21ff471a7744a507eaed10a6",
  email: "bob.w@example.com",
  firstName: "Bob",
  middleName: "H",
  lastName: "Storm",
  avatar: "/public/avatarZ.png",
  status: "active",
  roleId: "096b009d-015c-4f23-b3ca-a49faae377d8",
  createdAt: "2010-06-21T23:09:17.000Z",
  updatedAt: "2012-08-06T03:09:57.000Z"
};

let user4 = {
  id: "543bca14-4da8-444f-921b-b3fe1dcfff65",
  username: "DaveA",
  password: "a3189f12904485b899c61aa46a23bd7b",
  email: "dave.a@example.com",
  firstName: "Dave",
  middleName: "D",
  lastName: "Axe",
  avatar: "/public/avatarA.png",
  status: "active",
  roleId: "096b009d-015c-4f23-b3ca-a49faae377d8",
  createdAt: "2000-10-14T02:44:36.000Z",
  updatedAt: "2006-12-22T10:21:14.000Z"
};

module.exports = {
  "user1": user1,
  "user2": user2,
  "user3": user3,
  "user4": user4,
  "default": [
    user1,
    user2,
    user3,
    user4
  ],
  "orderByUsernameAsc": [
    user3,
    user4,
    user2,
    user1
  ],
  "orderByFirstNameDesc": [
    user1,
    user2,
    user4,
    user3
  ],
  "limitedAndOrderedAsc": [
    user3,
    user4,
    user2
  ],
  "limitedAndOrderedDesc": [
    user1,
    user2,
    user4
  ],
  "partial1": [
    {
      id: user3.id,
      username: user3.username,
      password: user3.password,
      email: user3.email,
      firstName: user3.firstName,
      middleName: user3.middleName,
      lastName: user3.lastName,
    }
  ],
  "partial2": [
    {
      avatar: user4.avatar,
      status: user4.status,
      roleId: user4.roleId,
      createdAt: user4.createdAt,
      updatedAt: user4.updatedAt
    }
  ],
  "aliased": [
    {
      nickname: user3.username,
      name: user3.firstName
    }
  ],
  "joinedWithRoles": [
    {
      id: user2.id,
      username: user2.username,
      firstName: user2.firstName,
      lastName: user2.lastName,
      roleId: user2.roleId,
      role: "user-admin-A"
    }
  ],

  // ---------------------------------
  // ----- GETTING SINGLE RECORD -----
  // ---------------------------------

  singleById: user4
};
