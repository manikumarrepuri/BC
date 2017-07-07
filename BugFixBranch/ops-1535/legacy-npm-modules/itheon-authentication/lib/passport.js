
"use strict";

var appRootPath   = require("app-root-path");
var passport      = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var UsersGateway  = require(appRootPath + "/lib/module/User/lib/gateway/user/httpUserGateway");
var usersGateway  = new UsersGateway();
var sha1Crypt     = require("sha1");
var Request       = require("itheon-request");
var BaseError     = require("itheon-error").BaseError;
var logger        = require("itheon-logger");
var _             = require("itheon-utility").underscore;
var config        = require("itheon-config");

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {

  // password needs to be removed!
  user.password = null;

  // save user
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function (username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      var request = new Request();
      request.setConditions({username: username});
      request.setLimit(1);
      usersGateway.fetchAll(request)
        .then(function (collection) {
          let users = collection.export();
          
          if (!_.isObject(users) || users.length > 1) {
            logger.error("Users mapper returned invalid(non-array) result");
            logger.error(users);
            throw new BaseError("Internal error");
          }

          if (_.isEmpty(users)) {
            return done(null, false, { message: "Unknown user"});
          }

          var user = users[Object.keys(users)[0]];

          var secret = config.get("authentication:secret");
          var passwordHash = sha1Crypt(password + secret);

          if (user.password != passwordHash) {
            logger.info("User " + username + " provided invalid password");
            return done(null, false, { message: "Invalid password" });
          }

          return done(null, user);
        }).done();
    });
  }
));

module.exports = passport;
