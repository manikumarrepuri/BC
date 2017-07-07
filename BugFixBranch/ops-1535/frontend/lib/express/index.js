
"use strict";

const appRootPath       = require("app-root-path");
const express           = require("express");
const fs                = require('fs');
const common            = require("opserve-common");
const config            = common.Config.get();
const logger            = common.logger;
const middleware        = common.middleware;
const app               = express();
const router            = express.Router();
const morgan            = require("morgan");

// ------- auth related stuff
const redisDataProvider = common.dataProvider.redisDataProvider;
const redis             = redisDataProvider.getRedisDataProvider();
//ops-1276: Below line will replaces with passport file. eiliminate the itheon-authentication package
// var passport          = require("itheon-authentication");
const passport          = require(appRootPath + "/lib/passport/passport");
const flash             = require("connect-flash");
const bodyParser        = require("body-parser");
const session           = require("express-session");
const cookieParser      = require("cookie-parser");
const RedisStore        = require("connect-redis")(session);

app.use(cookieParser(config.get("session:secret")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
app.use(bodyParser.json({
  extended: true
}));

app.use(session({
  resave : true,
  saveUninitialized: false,
  secret: config.get("session:secret"),
  store : new RedisStore({
    client: redis
  }),
  cookie : {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    maxAge : 24 * 60 * 60 * 1000 // one day
  }
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

process.on("uncaughtException", function(error) {
  logger.error("Uncaught Exception", error);
});

// setting up logger
if (config.get("logger:console")) {
  app.use(
    morgan(
      config.get("logger:format"),
      {
        immediate: config.get("logger:immediate")
      }
    )
  );
}

// ------- end of auth stuff

// add query builder object for every request
app.all("*", middleware.requestMiddleware.validate);

app.set("port", process.env.PORT || config.get("express:port"));

app.use("/static", express.static(appRootPath + "/public"));

// load our routes
require(appRootPath + "/app/routes.js")(router, passport);

app.use("/", router);

router.param("id", middleware.validatorMiddleware.id);

app.use(middleware.notFoundMiddleware);
app.use(middleware.errorMiddleware);


if(!config.get("express:ssl")) {
  var server = require("http").createServer(app);
} else {

  const syswidecas = require('syswide-cas');
  const https = require('https');
  const trustedCa = [
    config.get("certificate_paths:ca")
  ];

  https.globalAgent.options.ca = [];
  for (const ca of trustedCa) {
    https.globalAgent.options.ca.push(fs.readFileSync(ca));
    syswidecas.addCAs(ca);
  }

  //Allow self-signed cert
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  //Create credentials
  var credentials = {
    ca: fs.readFileSync(config.get("certificate_paths:ca")),
    cert: fs.readFileSync(config.get("certificate_paths:cert")),
    key: fs.readFileSync(config.get("certificate_paths:key")),
    strictSSL : false
  };

  var server = https.createServer(credentials, app);
}

server.listen(app.get("port"));
module.exports = app;

logger.info("Itheon Frontend is now running on port " + app.get("port") + ((config.get("express:ssl")) ? " using SSL" : ""));
