
"use strict";

var appRootPath = require("app-root-path");

var express    = require("express");
var http       = require("http");
var config     = require("itheon-config");
var middleware = require("itheon-middleware");
var app        = express();
var router     = express.Router();
var logger     = require("itheon-logger");

// ------- auth related stuff
var redis    = require("itheon-data-provider").redisDataProvider;
var passport = require("itheon-authentication");

var flash        = require("connect-flash");
var bodyParser   = require("body-parser");
var session      = require("express-session");
var cookieParser = require("cookie-parser");
var RedisStore   = require("connect-redis")(session);

app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json({
  extended: true
}));

app.use(session({
  resave : true,
  saveUninitialized: true,
  secret: config.get("session:secret"),
  store : new RedisStore({
    client: redis
  }),
  cookie : {
    expires: config.get("session:expires") || new Date(Date.now() + 24 * 60 * 60 * 1000),
    maxAge : config.get("session:maxAge") || 24 * 60 * 60 * 1000 // one day
  }
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// ------- end of auth stuff

// add query builder object for every request
app.all("*", middleware.query.validate);

app.set("port", process.env.PORT || config.get("express:port"));

app.use("/static", express.static(appRootPath + "/public"));

// load our routes
require(appRootPath + "/app/routes.js")(router, passport);

app.use("/", router);

router.param("id", middleware.validator.id);

app.use(middleware.notFound);
app.use(middleware.error);

http.createServer(app).listen(app.get("port"));
module.exports = app;

logger.info("Itheon Frontend is now running on port " + app.get("port"));
