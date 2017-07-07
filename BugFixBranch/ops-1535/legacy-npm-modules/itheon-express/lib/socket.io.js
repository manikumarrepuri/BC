
"use strict";

var appRootPath = require("app-root-path");
var logger      = require("itheon-logger");
var config      = require("itheon-config");

var io = require('socket.io').listen(config.get("socket.io:port"));

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

module.exports = io;
