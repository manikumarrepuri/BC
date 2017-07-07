
"use strict";

var appRootPath     = require('app-root-path');
var net             = require('net');
const common        = require("opserve-common");
const logger        = common.logger;
const config        = common.Config.get();
var ruleSet         = require('require-all')(appRootPath + '/lib/module/receiver/rules');
var HandlerService  = require(appRootPath + '/lib/handlerService');
var handlerService  = new HandlerService();

var InitializeService = require(appRootPath + "/lib/initializeService");
var initializeService = new InitializeService();

initializeService.start()
  .then(function() {
    var proxy = net.createServer({allowHalfOpen: true}, function (socket) {
      socket.setEncoding('utf8');

      logger.silly('Client connected to receiver');

      // as data comes in try to validate it as well
      socket.on('data', function(request) {
        logger.silly('Request received: ' + request);
        try {
          handlerService.handleIncomingData(request);
          socket.end("<?xml version=\"1.0\"?><ITHEON><Header><Version>0.1.0</Version><Product>Itheon Receiver</Product></Header><Body><Acknowledgement><Status> SUCCESS </Status></Acknowledgement></Body></ITHEON>");
        } catch (error) {
          logger.error('Error occurred: ' + error.message, error);
          socket.end("<status>FAILED</status><message>" + error.message + "</message>\n");
        }
      });

      socket.on('close', function () {
        logger.silly('Client disconnected from receiver');
      });

      socket.on('error', function (err) {
        logger.error('Socket Error: ' + err.toString(), err);
      });
    });

    //proxy.maxConnections = 800;
    proxy.listen({port: config.get("receiver:listenport"), backlog: 10000});
    logger.info('Itheon Receiver listening on port: ' + config.get("receiver:listenport"));
}).catch(function(error) {
  logger.error("Initialization - Error occurred", {
    error: error
  });
});
