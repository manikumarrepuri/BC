
"use strict";

var appRootPath = require("app-root-path");
var r           = require(appRootPath + "/lib/dataProvider/rethinkDbDataProvider");

module.exports = function() {

  return r.table("Ticket").delete().then(function () {

    var tickets = [
      {
        id: "f65a5fe6-371a-4216-884a-ab61047ab3db",
        name: "Install Grunt Watch",
        description: "<h4><b>Getting Started</b></h4><p><br/></p><p>NOTE: This plugin requires Grunt ~0.4.0</p><p><br/></p><p>If you haven\"t used Grunt before, be sure to check out the Getting Started guide, as it explains how to create a Gruntfile as well as install and use Grunt plugins. Once you\"re familiar with that process, you may install this plugin with this command:</p><pre>npm install grunt-contrib-watch --save-dev</pre><p>Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:</p><pre>grunt.loadNpmTasks(\"grunt-contrib-watch\");</pre><p></p>",
        storyPoints: 8,
        creatorId: "8d28e55b-1e77-479f-a3f6-c499c40be3ea",
        assigneeId: "8d28e55b-1e77-479f-a3f6-c499c40be3ea",
        comments: [
          {
            text: "Dependency on ...",
            userId: "76039cc1-96eb-4721-81b3-211b6979d018",
            status: "active",
            createdAt: new Date("2015-08-22T21:34:32.000Z"),
            updatedAt: null
          }
        ],
        status: "active",
        createdAt: new Date("2015-08-22T21:34:32.000Z"),
        updatedAt: null
      },
      {
        id: "c9a67fa1-9903-4bb7-a584-31ea0abdcdb6",
        name: "Validate files with JSHint",
        description: "<h4><b>Getting Started</b></h4><p><br/></p><p>NOTE: This plugin requires Grunt ~0.4.0</p><p><br/></p><p>If you haven\"t used Grunt before, be sure to check out the Getting Started guide, as it explains how to create a Gruntfile as well as install and use Grunt plugins. Once you\"re familiar with that process, you may install this plugin with this command:</p><pre>npm install grunt-contrib-jshint --save-dev</pre><p>Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:</p><pre>grunt.loadNpmTasks(\"grunt-contrib-jshint\");</pre>",
        storyPoints: 13,
        creatorId: "4c374646-ff38-4a8b-adf6-0bf0e3723c75",
        assigneeId: "ede8e906-03f4-40e8-9b8e-46c1aad72de6",
        comments: [
          {
            text: "Already fixed by ...",
            userId: "9f894edc-23cb-4704-aa65-39e90d3a078a",
            status: "active",
            createdAt: new Date("2015-08-22T21:34:32.000Z"),
            updatedAt: null
          }
        ],
        status: "deleted",
        createdAt: new Date("2015-08-22T21:34:32.000Z"),
        updatedAt: null
      },
      {
        id: "382f0878-29fd-4161-8231-fc931741e49f",
        name: "Minify files with UglifyJS",
        description: "<h4><b>Getting Started</b></h4><p><br/></p><p>NOTE: This plugin requires Grunt ~0.4.0</p><p><br/></p><p>If you haven\"t used Grunt before, be sure to check out the Getting Started guide, as it explains how to create a Gruntfile as well as install and use Grunt plugins. Once you\"re familiar with that process, you may install this plugin with this command:</p><pre>npm install grunt-contrib-uglify --save-dev</pre><p>Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:</p><pre>grunt.loadNpmTasks(\"grunt-contrib-uglify\");</pre>",
        storyPoints: 5,
        creatorId: "a5390c1c-eb83-4577-9446-cc1653102ee7",
        assigneeId: "761a6b5c-d5e9-484f-923f-079e6780bf65",
        status: "active",
        createdAt: new Date("2015-08-22T21:34:32.000Z"),
        updatedAt: null
      },
      {
        id: "647c3c3c-309d-476a-8891-c2d569ba14e1",
        name: "Clean files and folders",
        description: "<h4><b>Getting Started</b></h4><p><br/></p><p>NOTE: This plugin requires Grunt ~0.4.0</p><p><br/></p><p>If you haven\"t used Grunt before, be sure to check out the Getting Started guide, as it explains how to create a Gruntfile as well as install and use Grunt plugins. Once you\"re familiar with that process, you may install this plugin with this command:</p><pre>npm install grunt-contrib-clean --save-dev</pre><p>Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:</p><pre>grunt.loadNpmTasks(\"grunt-contrib-clean\");</pre>",
        storyPoints: 30,
        creatorId: "5510260a-70d0-4ff6-8ba6-b1fc0f019634",
        assigneeId: "b877bb53-86b9-40a3-849c-2b624ebb5dce",
        comments: [
          {
            text: "Sorry wont do it...",
            userId: "9f894edc-23cb-4704-aa65-39e90d3a078a",
            status: "active",
            createdAt: new Date("2015-08-22T21:34:32.000Z"),
            updatedAt: null
          }
        ],
        status: "pending",
        createdAt: new Date("2015-08-22T21:34:32.000Z"),
        updatedAt: null
      },
      {
        id: "61ad71eb-0ca2-49af-b371-c16599207bbc",
        name: "Concatenate files",
        description: "<h4><b>Getting Started</b></h4><p><br/></p><p>NOTE: This plugin requires Grunt ~0.4.0</p><p><br/></p><p>If you haven\"t used Grunt before, be sure to check out the Getting Started guide, as it explains how to create a Gruntfile as well as install and use Grunt plugins. Once you\"re familiar with that process, you may install this plugin with this command:</p><pre>npm install grunt-contrib-concat --save-dev</pre><p>Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:</p><pre>grunt.loadNpmTasks(\"grunt-contrib-concat\");</pre>",
        storyPoints: 3,
        creatorId: "d7885ec6-ece3-427a-b15c-c114d27d2f82",
        assigneeId: "e37134f4-ef5c-4a3e-883d-7ed7e23dc294",
        comments: [
          {
            text: "Should be marked as duplicate ...",
            userId: "b808972a-ec28-4d69-a194-d1e05c5ff0e8",
            status: "active",
            createdAt: new Date("2015-08-22T21:34:32.000Z"),
            updatedAt: null
          },
          {
            text: "Full regression tests are required ...",
            userId: "76039cc1-96eb-4721-81b3-211b6979d018",
            status: "active",
            createdAt: new Date("2015-08-22T21:34:32.000Z"),
            updatedAt: null
          }
        ],
        status: "active",
        createdAt: new Date("2015-08-22T21:34:32.000Z"),
        updatedAt: null
      }
    ];

    return r.table("Ticket").insert(tickets).run();

  }).then(function() {

    return r.table("User").delete();

  }).then(function() {

    var users = [
      {
        id: "b808972a-ec28-4d69-a194-d1e05c5ff0e8",
        username: "mina.hernadi",
        password: "6accdad680d6b4bdd7261e5ba71ffd9c3a8a3ec0",
        email: "mina.hernadi@hedonsoftware.com",
        firstName: "Mina",
        middleName: "D",
        lastName: "Hernadi",
        avatar: "/static/images/avatars/04.png",
        status: "active",
        roleId: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
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
        avatar: "/static/images/avatars/86.png",
        status: "active",
        roleId: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
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
        avatar: "/static/images/avatars/35.png",
        status: "active",
        roleId: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
        createdAt: new Date("2015-08-22T05:34:12.000Z"),
        updatedAt: null
      },
      {
        id: "ede8e906-03f4-40e8-9b8e-46c1aad72de6",
        username: "jardetzky.gallucio",
        password: "6accdad680d6b4bdd7261e5ba71ffd9c3a8a3ec0",
        email: "jardetzky.gallucio@hedonsoftware.com",
        firstName: "Jardetzky",
        middleName: null,
        lastName: "Gallucio",
        avatar: "/static/images/avatars/15.png",
        status: "active",
        roleId: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
        createdAt: new Date("2015-08-22T07:34:11.000Z"),
        updatedAt: null
      },
      {
        id: "76039cc1-96eb-4721-81b3-211b6979d018",
        username: "branco.rosenfield",
        password: "6accdad680d6b4bdd7261e5ba71ffd9c3a8a3ec0",
        email: "branco.rosenfield@hedonsoftware.com",
        firstName: "Branco",
        middleName: null,
        lastName: "Rosenfield",
        avatar: "/static/images/avatars/05.png",
        status: "active",
        roleId: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
        createdAt: new Date("2015-08-22T17:54:17.000Z"),
        updatedAt: null
      },
      {
        id: "9f894edc-23cb-4704-aa65-39e90d3a078a",
        username: "hamlin.keul",
        password: "6accdad680d6b4bdd7261e5ba71ffd9c3a8a3ec0",
        email: "hamlin.keul@hedonsoftware.com",
        firstName: "Hamlin",
        middleName: "J",
        lastName: "Keul",
        avatar: "/static/images/avatars/03.png",
        status: "active",
        roleId: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
        createdAt: new Date("2015-08-22T14:11:43.000Z"),
        updatedAt: null
      },
      {
        id: "a5390c1c-eb83-4577-9446-cc1653102ee7",
        username: "becky.hawkins",
        password: "6accdad680d6b4bdd7261e5ba71ffd9c3a8a3ec0",
        email: "becky.hawkins@hedonsoftware.com",
        firstName: "Becky",
        middleName: null,
        lastName: "Hawkins",
        avatar: "/static/images/avatars/42.png",
        status: "active",
        roleId: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
        createdAt: new Date("2015-08-22T07:34:11.000Z"),
        updatedAt: null
      },
      {
        id: "761a6b5c-d5e9-484f-923f-079e6780bf65",
        username: "biff.wellington",
        password: "6accdad680d6b4bdd7261e5ba71ffd9c3a8a3ec0",
        email: "biff.wellington@hedonsoftware.com",
        firstName: "Biff",
        middleName: null,
        lastName: "Wellington",
        avatar: "/static/images/avatars/27.png",
        status: "active",
        roleId: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
        createdAt: new Date("2015-08-22T15:23:43.000Z"),
        updatedAt: null
      },
      {
        id: "5510260a-70d0-4ff6-8ba6-b1fc0f019634",
        username: "lura.picard",
        password: "6accdad680d6b4bdd7261e5ba71ffd9c3a8a3ec0",
        email: "lura.picard@hedonsoftware.com",
        firstName: "Lura",
        middleName: null,
        lastName: "Picard",
        avatar: "/static/images/avatars/85.png",
        status: "active",
        roleId: "6eeac08b-818b-480f-896f-8e4ea3f57267",
        createdAt: new Date("2015-08-22T07:34:11.000Z"),
        updatedAt: null
      },
      {
        id: "b877bb53-86b9-40a3-849c-2b624ebb5dce",
        username: "rigoberto.rubin",
        password: "6accdad680d6b4bdd7261e5ba71ffd9c3a8a3ec0",
        email: "rigoberto.rubin@hedonsoftware.com",
        firstName: "Rigoberto",
        middleName: null,
        lastName: "Rubin",
        avatar: "/static/images/avatars/65.png",
        status: "active",
        roleId: "0c6acdbd-525d-4e15-84d2-7f630b7a6548",
        createdAt: new Date("2015-08-22T07:34:11.000Z"),
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
