
"use strict";

var _ = require("itheon-utility").underscore;

var user1 = {
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
};

var user2 = {
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
};

var user3 = {
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
};

var user4 = {
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
};

var user5 = {
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
};

var role1 = {
  id: "6eeac08b-818b-480f-896f-8e4ea3f57267",
  name: "admin",
  description: "Application administrator",
  parent: null,
  status: "active",
  createdAt: new Date("2015-08-22T23:12:31.000Z"),
  updatedAt: null
};

var role2 = {
  id: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
  name: "user",
  description: "Application user",
  parent: "d16db438-35a9-4dcc-946c-c2460aa7dda7",
  status: "active",
  createdAt: new Date("2015-08-22T12:17:02.000Z"),
  updatedAt: null
};

module.exports = {
  "all": [
    user1,
    user2,
    user3,
    user4,
    user5
  ],
  "limitedFields": [
    {
      id: user1.id,
      username: user1.username
    },
    {
      id: user2.id,
      username: user2.username
    },
    {
      id: user3.id,
      username: user3.username
    },
    {
      id: user4.id,
      username: user4.username
    },
    {
      id: user5.id,
      username: user5.username
    }
  ],
  "aliasedFields": [
    {
      userId: user1.id,
      userUsername: user1.username
    },
    {
      userId: user2.id,
      userUsername: user2.username
    },
    {
      userId: user3.id,
      userUsername: user3.username
    },
    {
      userId: user4.id,
      userUsername: user4.username
    },
    {
      userId: user5.id,
      userUsername: user5.username
    }
  ],
  "joinedWithRoles": [
    {
      userUsername: user1.username,
      roleName: "admin",
    },
    {
      userUsername: user2.username,
      roleName: "user",
    },
    {
      userUsername: user3.username,
      roleName: "admin",
    },
    {
      userUsername: user4.username,
      roleName: "user",
    },
    {
      userUsername: user5.username,
      roleName: "user",
    }
  ],
  "joinedWithRolesAllUserFields": [
    _.extend(_.clone(user1), {name: "admin"}),
    _.extend(_.clone(user2), {name: "user"}),
    _.extend(_.clone(user3), {name: "admin"}),
    _.extend(_.clone(user4), {name: "user"}),
    _.extend(_.clone(user5), {name: "user"})
  ],
  "usersInId": [
    {
      userUsername: user3.username
    },
    {
      userUsername: user4.username
    }
  ],
  "usersNinId": [
    {
      userUsername: user1.username
    },
    {
      userUsername: user2.username
    },
    {
      userUsername: user5.username
    }
  ],
  "usersComplexConditions": [
    {
      userUsername: user2.username
    },
    {
      userUsername: user5.username
    }
  ],
  "usersOrderedByUsernameAsc": [
    {
      userUsername: user2.username
    },
    {
      userUsername: user3.username
    },
    {
      userUsername: user5.username
    },
    {
      userUsername: user1.username
    },
    {
      userUsername: user4.username
    }
  ],
  "usersOrderedByUsernameDesc": [
    {
      userUsername: user4.username
    },
    {
      userUsername: user1.username
    },
    {
      userUsername: user5.username
    },
    {
      userUsername: user3.username
    },
    {
      userUsername: user2.username
    }
  ],
  "usersOrderedByMultiAsc": [
    {
      username: user2.username,
      roleId: user2.roleId
    },
    {
      username: user5.username,
      roleId: user5.roleId
    },
    {
      username: user4.username,
      roleId: user4.roleId
    },
    {
      username: user3.username,
      roleId: user3.roleId
    },
    {
      username: user1.username,
      roleId: user1.roleId
    }
  ],
  "usersOrderedByMultiDesc": [
    {
      username: user1.username,
      roleId: user1.roleId
    },
    {
      username: user3.username,
      roleId: user3.roleId
    },
    {
      username: user4.username,
      roleId: user4.roleId
    },
    {
      username: user5.username,
      roleId: user5.roleId
    },
    {
      username: user2.username,
      roleId: user2.roleId
    }
  ],
  "usersOrderedByMultiMixed": [
    {
      username: user3.username,
      roleId: user3.roleId
    },
    {
      username: user1.username,
      roleId: user1.roleId
    },
    {
      username: user2.username,
      roleId: user2.roleId
    },
    {
      username: user5.username,
      roleId: user5.roleId
    },
    {
      username: user4.username,
      roleId: user4.roleId
    }
  ],
  "usersQueryLevel1Results": [
    {
      id: user2.id,
      username: user2.username,
      age: user2.age,
      roleId: user2.roleId,
      roleName: "user"
    }
  ]
};