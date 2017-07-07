
"use strict";

const appRootPath   = require("app-root-path");
const common        = require("opserve-common");
const logger        = common.logger;
const config        = common.Config.get();
const express       = require('express');
const app           = express();

if(!config.get("socket.io:ssl")) {
  var server  = require("http").createServer(app);
} else {
  var fs = require("fs");

  //Allow self-signed cert
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  //Create credentials
  var credentials = {
    ca: fs.readFileSync('/opt/itheon/itheonChain.crt'),
    cert: fs.readFileSync('/opt/itheon/itheon.crt'),
    key: fs.readFileSync('/opt/itheon/itheon.key'),
    strictSSL : false
  };
  var server = require('https').createServer(credentials, app);
}

var io = require('socket.io').listen(server);

var clients = {};
io.sockets.on('connection', function (socket) {
  var that = this;

  logger.info("Socket connected: " + socket.id);
  clients[socket.id] = socket;

  socket.on('disconnect', function() {
    logger.info("Socket disconnected: " + socket.id);
    delete clients[socket.id];
    socket = null;
  });
});

server.listen(config.get("socket.io:port"), function() {
  logger.info("Waiting for websockets on port: " + config.get("socket.io:port") + ((config.get("express:ssl")) ? " using SSL" : ""));
});

module.exports = io;
