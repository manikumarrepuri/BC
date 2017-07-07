
"use strict";

var appRootPath = require("app-root-path");

var app     = require("../../app");
var request = require("supertest");
var assert  = require("chai").assert;
var moment  = require("moment");
var _       = require("opserve-common").utilities.underscore;

var TestHelper = require("itheon-test").helper;
var testHelper = new TestHelper(__filename);

var expectedUsers = testHelper.getDataProvider("sampleUsers");

describe("Users resource", function () {

  beforeEach(function (done) {
    testHelper.executeFixtureScript("sampleUsers", done);
  });

  describe("when requesting resource /users", function () {
    it("should respond with users", function (done) {
      request(app)
        .get("/users")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var users = JSON.parse(res.text);
          _.each(expectedUsers.default, function(result) {
            assert.include(users, result);
          });
          done();
      });
    });
  });

  describe("when requesting resource /users", function () {
    it("should respond with users", function (done) {
      request(app)
        .get("/users" +
          "?fields[]=u.*"
        )
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var users = JSON.parse(res.text);
          _.each(expectedUsers.default, function(result) {
            assert.include(users, result);
          });
          done();
      });
    });
  });

  describe("when requesting resource /users with first pack of fields", function () {
    it("should respond with fields (part1) users", function (done) {
      request(app)
        .get("/users" +
             "?conditions[username]=BobW" +
             "&fields[]=id" +
             "&fields[]=username" +
             "&fields[]=password" +
             "&fields[]=email" +
             "&fields[]=firstName" +
             "&fields[]=middleName" +
             "&fields[]=lastName")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var user = JSON.parse(res.text);
          assert.deepEqual(user, expectedUsers.partial1);
          done();
      });
    });
  });

  describe("when requesting resource /users with aliases of fields", function () {
    it("should respond with users with aliased fields", function (done) {
      request(app)
        .get("/users" +
             "?conditions[username]=BobW" +
             "&fields[username]=nickname" +
             "&fields[firstName]=name")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var user = JSON.parse(res.text);
          assert.deepEqual(user, expectedUsers.aliased);
          done();
      });
    });
  });

  describe("when requesting resource /users with second pack of fields by username", function () {
    it("should respond with fields (part2) users", function (done) {
      request(app)
        .get("/users" +
             "?conditions[username]=DaveA" +
             "&fields[]=avatar" +
             "&fields[]=status" +
             "&fields[]=roleId" +
             "&fields[]=createdAt" +
             "&fields[]=updatedAt")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var user = JSON.parse(res.text);
          assert.deepEqual(user, expectedUsers.partial2);
          done();
      });
    });
  });

  describe("when requesting resource /users with second pack of fields by user id", function () {
    it("should respond with fields (part2) users", function (done) {
      request(app)
        .get("/users" +
             "?conditions[id]=543bca14-4da8-444f-921b-b3fe1dcfff65" +
             "&fields[]=avatar" +
             "&fields[]=status" +
             "&fields[]=roleId" +
             "&fields[]=createdAt" +
             "&fields[]=updatedAt")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var user = JSON.parse(res.text);
          assert.deepEqual(user, expectedUsers.partial2);
          done();
      });
    });
  });

  describe("when requesting resource /users with order by username ASC", function () {
    it("should respond with ordered list of users", function (done) {
      request(app)
        .get("/users?order[username]=asc")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var user = JSON.parse(res.text);
          assert.deepEqual(user, expectedUsers.orderByUsernameAsc);
          done();
      });
    });
  });

  describe("when requesting resource /users with order by firstname DESC", function () {
    it("should respond with ordered list of users", function (done) {
      request(app)
        .get("/users?order[firstName]=desc")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var user = JSON.parse(res.text);
          assert.deepEqual(user, expectedUsers.orderByFirstNameDesc);
          done();
      });
    });
  });

  describe("when requesting resource /users with order by non-existing field", function () {
    it("should respond with 400 error", function (done) {
      request(app)
        .get("/users?order[nonExisting]=desc")
        .expect("Content-Type", /json/)
        .expect(400, done);
    });
  });

  describe("when requesting resource /users with specified limit and order by username ASC", function () {
    it("should respond with limited number of users and ordered ASC", function (done) {
      request(app)
        .get("/users?order[username]=asc&limit=3")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var user = JSON.parse(res.text);
          assert.deepEqual(user, expectedUsers.limitedAndOrderedAsc);
          done();
      });
    });
  });

  describe("when requesting resource /users with specified limit and order by username DESC", function () {
    it("should respond with limited number of users and ordered DESC", function (done) {
      request(app)
        .get("/users?order[username]=desc&limit=3")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var user = JSON.parse(res.text);
          assert.deepEqual(user, expectedUsers.limitedAndOrderedDesc);
          done();
      });
    });
  });

  describe("when requesting resource /users with specified limit", function () {
    it("should respond with limited number of users", function (done) {
      request(app)
        .get("/users?limit=2")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var users = JSON.parse(res.text);
          assert.equal(users.length, 2);
          done();
      });
    });
  });

  describe("when requesting resource /users with specified join on role, fields and condition", function () {

    before(function (done) {
      testHelper.executeFixtureScript("sampleRoles", done);
    });

    it("should respond with users joined with roles", function (done) {
      request(app)
        .get(
          "/users" +
          "?fields[]=u.id" +
          "&fields[]=u.username" +
          "&fields[]=u.firstName" +
          "&fields[]=u.lastName" +
          "&fields[r.name]=role" +
          "&fields[]=u.roleId" +
          "&joins[]=role" +
          "&conditions[u.id]=3430e7f2-bb2a-4b36-97da-8454db63e877"
        )
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var user = JSON.parse(res.text);
          assert.deepEqual(user, expectedUsers.joinedWithRoles);
          done();
      });
    });
  });

  // --------------------------------------------------------------------------- //
  // -------------------------- GETTING SINGLE RECORD -------------------------- //
  // --------------------------------------------------------------------------- //

  describe("when requesting resource /users/:id", function () {
    it("should respond with single user", function (done) {
      request(app)
        .get("/users/543bca14-4da8-444f-921b-b3fe1dcfff65")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var user = JSON.parse(res.text);
          assert.deepEqual(user, expectedUsers.singleById);
          done();
      });
    });
  });

  describe("when requesting resource by invalid id /users/:id", function () {
    it("should respond with 400", function (done) {
      request(app)
        .get("/users/-1")
        .expect("Content-Type", /json/)
        .expect(400, done);
    });
  });

  describe("when requesting non-existing resource /users/:id", function () {
    it("should respond with 404", function (done) {
      request(app)
        .get("/users/12345678-1234-1234-1234-123456789012")
        .expect("Content-Type", /json/)
        .expect(404, done);
    });
  });

  describe("when requesting non-existing resource /users/:id - penetration testing", function () {
    it("should respond with 400", function (done) {
      request(app)
        .get("/users/12\"%20OR%201=1") // 12" OR 1=1
        .expect("Content-Type", /json/)
        .expect(400, done);
    });
  });

  // --------------------------------------------------------------------------- //
  // ----------------------------- CREATING RECORD ----------------------------- //
  // --------------------------------------------------------------------------- //

  describe("when posting resource to /users with dates", function () {

    before(function (done) {
      testHelper.executeFixtureScript("sampleRoles", done);
    });

    var newUser = {
      username: "NewUser",
      password: "3bd7ba3189f12904485b899c61aa46a2",
      email: "new.user@example.com",
      firstName: "New",
      middleName: "User",
      lastName: "Doe",
      avatar: "/public/img/avatar_1232345.png",
      status: "deleted",
      roleId: "40603aa2-5801-44c0-98b9-ab0be0987fcb",
      createdAt: "2000-10-14 02:44:36",
      updatedAt: "2001-10-14 02:44:36"
    };

    it("should respond with 201 and URL to newly created resource", function (done) {
      request(app)
        .post("/users")
        .send(newUser)
        .expect("Content-Type", /json/)
        .expect(201)
        .end(function (err, res) {

          var user = JSON.parse(res.text);

          var location = res.header.location;
          assert.equal(location, "/users/" + user.id);

          // overwriting
          newUser.id = user.id;
          newUser.createdAt = user.createdAt;
          newUser.updatedAt = null;

          assert.deepEqual(user, newUser);

          // comparing times
          assert.equal(newUser.updatedAt, null);
          var currentTimestamp = moment();
          var createdAt = moment(newUser.createdAt);

          // it should be less then 5 seconds difference
          assert.equal(currentTimestamp.diff(createdAt) < 5000, true);

          request(app)
            .get("/users/" + user.id)
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
              var user = JSON.parse(res.text);
              assert.deepEqual(user, newUser);
              done();
          });
      });
    });
  });

  describe("when posting resource to /users (default dates test)", function () {

    before(function (done) {
      testHelper.executeFixtureScript("sampleRoles", done);
    });

    var newUser = {
      username: "NewUserDefaultDate",
      password: "3bd7ba3189f12904485b899c61aa46a2",
      email: "new.user@example.com",
      firstName: "New",
      middleName: "User",
      lastName: "Doe",
      avatar: "/public/img/avatar_1232345.png",
      status: "deleted",
      roleId: 1
    };

    it("should respond with 201 and URL to newly created resource", function (done) {
      request(app)
        .post("/users")
        .send(newUser)
        .expect("Content-Type", /json/)
        .expect(201)
        .end(function (err, res) {

          var user = JSON.parse(res.text);

          var location = res.header.location;
          assert.equal(location, "/users/" + user.id);

          newUser.id = user.id;

          // overwriting
          newUser.createdAt = user.createdAt;
          newUser.updatedAt = null;

          assert.deepEqual(user, newUser);

          // comparing times
          assert.equal(newUser.updatedAt, null);
          var currentTimestamp = moment();
          var createdAt = moment(newUser.createdAt);

          // it should be less then 5 seconds difference
          assert.equal(currentTimestamp.diff(createdAt) < 5000, true);

          request(app)
            .get("/users/" + user.id)
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
              var user = JSON.parse(res.text);

              assert.deepEqual(user, newUser);

              // comparing times
              assert.equal(newUser.updatedAt, null);
              var currentTimestamp = moment();
              var createdAt = moment(newUser.createdAt);

              // it should be less then 5 seconds difference
              assert.equal(currentTimestamp.diff(createdAt) < 5000, true);
              done();
          });
      });
    });
  });

  describe("when posting invalid user resource to /users", function () {

    it("should respond with 400", function (done) {
      request(app)
        .post("/users")
        .send("invalid")
        .expect("Content-Type", /json/)
        .expect(400)
        .end(done);
    });
  });

  describe("when posting invalid json to /users", function () {

    it("should respond with 400", function (done) {
      request(app)
        .post("/users")
        .send("{\"still looks fine\" : 1, \"butNotHere\" :")
        .expect("Content-Type", /json/)
        .expect(400, done); // it"s not possible to send invalid json via supertest...
    });
  });

  describe("when posting user resource with the same username to /users", function () {

    before(function (done) {
      testHelper.executeFixtureScript("sampleRoles", done);
    });

    var newUser = {
      "username" : "GeorgeC",
      "password" : "3bd7ba3189f12904485b899c61aa46a2",
      "email" : "new.user@example.com",
      "firstName" : "New",
      "middleName" : "User",
      "lastName" : "Doe",
      "avatar" : "/public/img/avatar_1232345.png",
      "status" : "deleted",
      "roleId" : 1
    };

    var expectedError = {
      "type": "GatewayError",
      "data": {},
      "errorCode": 409,
      "message": "Username already in use"
    };

    it("should respond with 409 and error description", function (done) {
      request(app)
        .post("/users")
        .send(newUser)
        .expect("Content-Type", /json/)
        .expect(409)
        .end(function (err, res) {
          var error = JSON.parse(res.error.text);
          assert.deepEqual(error, expectedError);
          done();
      });
    });
  });

  // -------------------------------------------------------------------------- //
  // ----------------------------- UPDATING RECORD ---------------------------- //
  // -------------------------------------------------------------------------- //

  describe("when patching(updating) resource to /users/:id (with dates)", function () {

    before(function (done) {
      testHelper.executeFixtureScript("sampleRoles", done);
    });

    var updatedUser = {
      username: "UpdatedUser",
      password: "189f12904485b899c61aa46a23bd7ba3",
      email: "updated.user@example.com",
      firstName: "Updated",
      middleName: "User",
      lastName: "Fi",
      avatar: "/public/img/avatar_34353434.png",
      status: "inactive",
      roleId: "096b009d-015c-4f23-b3ca-a49faae377d8",
      createdAt: "2000-10-14 02:44:36",
      updatedAt: "2006-12-22 10:21:14"
    };

    let expectedUpdatedUser = JSON.parse(JSON.stringify(expectedUsers.user1));
    expectedUpdatedUser = _.extend(expectedUpdatedUser, updatedUser);
    expectedUpdatedUser.createdAt = "1984-08-10T22:53:58.000Z";

    it("should respond with 200 and updated resource", function (done) {
      request(app)
        .patch("/users/8c20c084-e341-47bc-a5a5-cc0380a2a310")
        .send(updatedUser)
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {

          var user = JSON.parse(res.text);

          // overwriting
          expectedUpdatedUser.updatedAt = user.updatedAt;

          assert.deepEqual(user, expectedUpdatedUser);

          // comparing times
          var currentTimestamp = moment();
          var updatedAt = moment(user.updatedAt);

          // it should be less then 5 seconds difference
          assert.equal(currentTimestamp.diff(updatedAt) < 5000, true);

          request(app)
            .get("/users/8c20c084-e341-47bc-a5a5-cc0380a2a310")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
              var user = JSON.parse(res.text);
              assert.deepEqual(user, expectedUpdatedUser);
              done();
          });
      });
    });
  });

  describe("when patching(updating) resource to /users/:id (default dates)", function () {

    before(function (done) {
      testHelper.executeFixtureScript("sampleRoles", done);
    });

    var updatedUser = {
      username: "UpdatedUser",
      password: "189f12904485b899c61aa46a23bd7ba3",
      email: "updated.user@example.com",
      firstName: "Updated",
      middleName: "User",
      lastName: "Fi",
      avatar: "/public/img/avatar_34353434.png",
      status: "inactive",
      roleId: "096b009d-015c-4f23-b3ca-a49faae377d8"
    };

    let expectedUpdatedUser = JSON.parse(JSON.stringify(expectedUsers.user2));
    expectedUpdatedUser = _.extend(expectedUpdatedUser, updatedUser);

    it("should respond with 200 and updated resource", function (done) {
      request(app)
        .patch("/users/3430e7f2-bb2a-4b36-97da-8454db63e877")
        .send(updatedUser)
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {

          var user = JSON.parse(res.text);
          expectedUpdatedUser.updatedAt = user.updatedAt;

          // comparing times
          var currentTimestamp = moment();
          var updatedAt = moment(user.updatedAt);

          // it should be less then 5 seconds difference
          assert.equal(currentTimestamp.diff(updatedAt) < 5000, true);

          assert.deepEqual(user, expectedUpdatedUser);

          request(app)
            .get("/users/3430e7f2-bb2a-4b36-97da-8454db63e877")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
              var user = JSON.parse(res.text);

              assert.deepEqual(user, expectedUpdatedUser);

              // comparing times
              var currentTimestamp = moment();
              var updatedAt = moment(user.updatedAt);

              // it should be less then 5 seconds difference
              assert.equal(currentTimestamp.diff(updatedAt) < 5000, true);
              done();
          });
      });
    });
  });

  describe("when patching(updating) partial resource to /users/:id", function () {

    before(function (done) {
      testHelper.executeFixtureScript("sampleRoles", done);
    });

    var updatedUser = {
      username: "UpdatedUser",
      email: "updated.user@example.com",
      firstName: "Updated"
    };

    let expectedUpdatedUser = JSON.parse(JSON.stringify(expectedUsers.user2));
    expectedUpdatedUser = _.extend(expectedUpdatedUser, updatedUser);

    it("should respond with 200 and updated resource", function (done) {
      request(app)
        .patch("/users/3430e7f2-bb2a-4b36-97da-8454db63e877")
        .send(updatedUser)
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {

          var user = JSON.parse(res.text);

          expectedUpdatedUser.updatedAt = user.updatedAt;

          // comparing times
          var currentTimestamp = moment();
          var updatedAt = moment(user.updatedAt);

          // it should be less then 5 seconds difference
          assert.equal(currentTimestamp.diff(updatedAt) < 5000, true);

          assert.deepEqual(user, expectedUpdatedUser);

          request(app)
            .get("/users/3430e7f2-bb2a-4b36-97da-8454db63e877")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
              var user = JSON.parse(res.text);

              assert.deepEqual(user, expectedUpdatedUser);

              // comparing times
              var currentTimestamp = moment();
              var updatedAt = moment(user.updatedAt);

              // it should be less then 5 seconds difference
              assert.equal(currentTimestamp.diff(updatedAt) < 5000, true);
              done();
          });
      });
    });
  });

  describe("when patching(updating) with invalid user resource to /users/:id", function () {

    it("should respond with 409", function (done) {
      request(app)
        .patch("/users/3430e7f2-bb2a-4b36-97da-8454db63e877")
        .send("invalid")
        .expect("Content-Type", /json/)
        .expect(400, done);
    });
  });

  describe("when patching(updating) non-existing resource to /users/:id", function () {

    before(function (done) {
      testHelper.executeFixtureScript("sampleRoles", done);
    });

    var newUser = {
      username: "UpdatedUser",
      password: "189f12904485b899c61aa46a23bd7ba3",
      email: "updated.user@example.com",
      firstName: "Updated",
      middleName: "User",
      lastName: "Fi",
      avatar: "/public/img/avatar_43534543.png",
      status: "inactive",
      roleId: "096b009d-015c-4f23-b3ca-a49faae377d8",
      createdAt: "2000-10-14 02:44:36",
      updatedAt: "2006-12-22 10:21:14"
    };

    it("should respond with 409 conflict response", function (done) {
      request(app)
        .patch("/users/33333333-bb2a-4b36-97da-8454db63e333")
        .send(newUser)
        .expect("Content-Type", /json/)
        .expect(409, done);
    });
  });

  // -------------------------------------------------------------------------- //
  // ---------------------------- REPLACING RECORD ---------------------------- //
  // -------------------------------------------------------------------------- //
  // ------------- Replacing is disabled as it doesn't make sense ------------- //
  // -------------------------------------------------------------------------- //

  // describe("when putting(replacing) resource to /users/:id (with dates)", function () {

  //   before(function (done) {
  //     testHelper.executeFixtureScript("sampleRoles", done);
  //   });

  //   var updatedUser = {
  //     username: "UpdatedUser",
  //     password: "189f12904485b899c61aa46a23bd7ba3",
  //     email: "updated.user@example.com",
  //     firstName: "Updated",
  //     middleName: "User",
  //     lastName: "Fi",
  //     avatar: "/public/img/avatar_34353434.png",
  //     status: "inactive",
  //     roleId: "096b009d-015c-4f23-b3ca-a49faae377d8",
  //     createdAt: "2000-10-14 02:44:36",
  //     updatedAt: "2006-12-22 10:21:14"
  //   };

  //   it("should respond with 200 and updated resource", function (done) {
  //     request(app)
  //       .put("/users/8c20c084-e341-47bc-a5a5-cc0380a2a310")
  //       .send(updatedUser)
  //       .expect("Content-Type", /json/)
  //       .expect(200)
  //       .end(function (err, res) {

  //         updatedUser.id = "8c20c084-e341-47bc-a5a5-cc0380a2a310";
  //         var user = JSON.parse(res.text);

  //         // overwriting
  //         updatedUser.createdAt = "1984-08-10T22:53:58.000Z";
  //         updatedUser.updatedAt = user.updatedAt;

  //         assert.deepEqual(user, updatedUser);

  //         // comparing times
  //         var currentTimestamp = moment();
  //         var updatedAt = moment(updatedUser.updatedAt);

  //         // it should be less then 5 seconds difference
  //         assert.equal(currentTimestamp.diff(updatedAt) < 5000, true);

  //         request(app)
  //           .get("/users/8c20c084-e341-47bc-a5a5-cc0380a2a310")
  //           .expect("Content-Type", /json/)
  //           .expect(200)
  //           .end(function (err, res) {
  //             var user = JSON.parse(res.text);
  //             assert.deepEqual(user, updatedUser);
  //             done();
  //         });
  //     });
  //   });
  // });

  // describe("when putting(replacing) resource to /users/:id (default dates)", function () {

  //   before(function (done) {
  //     testHelper.executeFixtureScript("sampleRoles", done);
  //   });

  //   var updatedUser = {
  //     username: "UpdatedUser",
  //     password: "189f12904485b899c61aa46a23bd7ba3",
  //     email: "updated.user@example.com",
  //     firstName: "Updated",
  //     middleName: "User",
  //     lastName: "Fi",
  //     avatar: "/public/img/avatar_34353434.png",
  //     status: "inactive",
  //     roleId: "096b009d-015c-4f23-b3ca-a49faae377d8"
  //   };

  //   it("should respond with 200 and updated resource", function (done) {
  //     request(app)
  //       .put("/users/3430e7f2-bb2a-4b36-97da-8454db63e877")
  //       .send(updatedUser)
  //       .expect("Content-Type", /json/)
  //       .expect(200)
  //       .end(function (err, res) {

  //         updatedUser.id = "3430e7f2-bb2a-4b36-97da-8454db63e877";
  //         updatedUser.createdAt = "1971-02-20T02:24:00.000Z";

  //         var user = JSON.parse(res.text);
  //         updatedUser.updatedAt = user.updatedAt;

  //         // comparing times
  //         var currentTimestamp = moment();
  //         var updatedAt = moment(user.updatedAt);

  //         // it should be less then 5 seconds difference
  //         assert.equal(currentTimestamp.diff(updatedAt) < 5000, true);

  //         assert.deepEqual(user, updatedUser);

  //         request(app)
  //           .get("/users/3430e7f2-bb2a-4b36-97da-8454db63e877")
  //           .expect("Content-Type", /json/)
  //           .expect(200)
  //           .end(function (err, res) {
  //             var user = JSON.parse(res.text);

  //             // overwriting updatedAt (created should stay as it was)
  //             updatedUser.updatedAt = user.updatedAt;

  //             assert.deepEqual(user, updatedUser);

  //             // comparing times
  //             var currentTimestamp = moment();
  //             var updatedAt = moment(user.updatedAt);

  //             // it should be less then 5 seconds difference
  //             assert.equal(currentTimestamp.diff(updatedAt) < 5000, true);
  //             done();
  //         });
  //     });
  //   });
  // });

  // describe("when putting(replacing) part of resource to /users/:id", function () {

  //   before(function (done) {
  //     testHelper.executeFixtureScript("sampleRoles", done);
  //   });

  //   var userId = "3430e7f2-bb2a-4b36-97da-8454db63e877";

  //   var updatedUser = {
  //     username: "UpdatedUser",
  //     password: "189f12904485b899c61aa46a23bd7ba3"
  //   };

  //   it("should respond with 200 and updated resource", function (done) {
  //     request(app)
  //       .put("/users/" + userId)
  //       .send(updatedUser)
  //       .expect("Content-Type", /json/)
  //       .expect(200)
  //       .end(function (err, res) {

  //         var user = JSON.parse(res.text);

  //         updatedUser.id = userId;
  //         updatedUser.createdAt = "1971-02-20T02:24:00.000Z";
  //         updatedUser.updatedAt = user.updatedAt;

  //         assert.deepEqual(user, updatedUser);

  //         // comparing times
  //         var currentTimestamp = moment();
  //         var updatedAt = moment(user.updatedAt);

  //         // it should be less then 5 seconds difference
  //         assert.equal(currentTimestamp.diff(updatedAt) < 5000, true);

  //         request(app)
  //           .get("/users/" + userId)
  //           .expect("Content-Type", /json/)
  //           .expect(200)
  //           .end(function (err, res) {
  //             var user = JSON.parse(res.text);

  //             // overwriting updatedAt (created should stay as it was)
  //             updatedUser.updatedAt = user.updatedAt;

  //             assert.deepEqual(user, updatedUser);

  //             // comparing times
  //             var currentTimestamp = moment();
  //             var updatedAt = moment(user.updatedAt);

  //             // it should be less then 5 seconds difference
  //             assert.equal(currentTimestamp.diff(updatedAt) < 5000, true);
  //             done();
  //         });
  //     });
  //   });
  // });

  // describe("when putting(replacing) with invalid user resource to /users/:id", function () {

  //   it("should respond with 400", function (done) {
  //     request(app)
  //       .put("/users/3430e7f2-bb2a-4b36-97da-8454db63e877")
  //       .send("invalid")
  //       .expect("Content-Type", /json/)
  //       .expect(400, done);
  //   });
  // });

  // describe("when putting(replacing non-existing resource to /users/:id", function () {

  //   before(function (done) {
  //     testHelper.executeFixtureScript("sampleRoles", done);
  //   });

  //   var newUser = {
  //     username: "UpdatedUser",
  //     password: "189f12904485b899c61aa46a23bd7ba3",
  //     email: "updated.user@example.com",
  //     firstName: "Updated",
  //     middleName: "User",
  //     lastName: "Fi",
  //     avatar: "/public/img/avatar_43534543.png",
  //     status: "inactive",
  //     roleId: "096b009d-015c-4f23-b3ca-a49faae377d8",
  //     createdAt: "2000-10-14 02:44:36",
  //     updatedAt: "2006-12-22 10:21:14"
  //   };

  //   it("should respond with 409 conflict response", function (done) {
  //     request(app)
  //       .put("/users/33333333-bb2a-4b36-97da-8454db63e333")
  //       .send(newUser)
  //       .expect("Content-Type", /json/)
  //       .expect(409, done);
  //   });
  // });

  // --------------------------------------------------------------------------- //
  // ----------------------------- DELETING RECORD ----------------------------- //
  // --------------------------------------------------------------------------- //

  describe("when deleting resource /users/:id", function () {

    it("should respond with 204 and updated resource", function (done) {
      request(app)
        .del("/users/9e766179-b515-4b91-a43c-b3ee1f7f43d8")
        .expect("Content-Type", /json/)
        .expect(204)
        .end(function (err, res) {
        request(app)
          .get("/users/9e766179-b515-4b91-a43c-b3ee1f7f43d8")
          .expect("Content-Type", /json/)
          .expect(404, done);
      });
    });
  });

  describe("when deleting non-existing resource /users/:id", function () {

    it("should respond with 409", function (done) {
      request(app)
        .del("/users/12345678-1234-1234-1234-123456789012")
        .expect("Content-Type", /json/)
        .expect(409, done);
    });
  });

  describe("when deleting non-existing resource /users/:id - penetration testing", function () {

    it("should respond with 400", function (done) {
      request(app)
        .del("/users/12\"%20OR%201=1") // 12" OR 1=1
        .expect("Content-Type", /json/)
        .expect(400, done);
    });
  });
});