
"use strict";
const appRootPath   = require("app-root-path");
const express       = require("express");
const common        = require("opserve-common");
const config        = common.Config.get();
const middleware    = common.middleware;
const morganLogger  = require("morgan");
const logger        = common.logger;
const bodyParser    = require("body-parser");
const app           = express();
const router        = express.Router();
var mongoose;

const fs    = require("fs");
const syswidecas = require('syswide-cas');
const https = require('https');
const http = require('http');

//Establish mongo connection. Get the details from the config file.
// mongoose.connect('mongodb://localhost:27017/testdb');
if(process.env.NODE_ENV != 'test')
{
  mongoose = require('mongoose');
  mongoose.connect(config.get("mongo:db"));
}else{
  mongoose = require(appRootPath + "/tests/modules/db/mongoMock");
}
app.set("port", process.env.PORT || config.get("server:port"));

process.on("uncaughtException", function(error) {
  logger.error("Uncaught Exception", error);
});

// setting up logger
if (config.get("logger:console")) {
  app.use(
    morganLogger(
      config.get("logger:format"),
      {
        immediate: config.get("logger:immediate")
      }
    )
  );
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
app.use(bodyParser.json({
  extended: true
}));

app.post("*", middleware.validatorMiddleware.requestData);
app.put("*", middleware.validatorMiddleware.requestData);
app.patch("*", middleware.validatorMiddleware.requestData);
app.all("*", middleware.requestMiddleware.validate);

// load our routes
require(appRootPath + "/app/routes.js")(router);

//Tanny for directly connecting to backend API OPS-1376
var allowCORS = function(req,res, next) {
  
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
   
    next();
  //}
};

app.use(allowCORS);

//Tanny for directly connecting to backend API OPS-1376

app.use("/", router);

// response with not found(404) when invalid link queried
// response with internal server error(500) and logger error
app.use(middleware.notFoundMiddleware);
app.use(middleware.errorMiddleware);

if(!config.get("server:ssl")) {
  var server = http.createServer(app);
} else {
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

// adding Socket.io support
require("./socket")(server);

server.listen(app.get("port"));

module.exports = app;

logger.info("Itheon API is now running on port " + app.get("port") + ((config.get("server:ssl")) ? " using SSL" : ""));
