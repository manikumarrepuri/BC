"use strict";

var appRootPath = require("app-root-path");
const common = require("opserve-common");
const logger = common.logger;
const config = common.Config.get();
const AmqpGateway = common.gateway.AmqpQueueGateway;
const mongoInitialize = common.db.initialize;
var mongoose = require('mongoose');
//Establish mongo connection. Get the details from the config file.
// mongoose.connect('mongodb://localhost:27017/testdb');

mongoose.connect(config.get("mongo:db"), {
  server: {
    socketOptions: {
      connectTimeoutMS: 600000,
      socketTimeoutMS: 500000
    }
  }
});
var InitializeService = require("./lib/initializeService");
var initializeService = new InitializeService();

var HandlerService = require("./lib/handlerService");
var handlerService = new HandlerService();

var DeviceEntity = require("itheon-module-device-entity").DeviceEntity;
var DevicesCollectionEntity = require("itheon-module-device-entity").DeviceCollectionEntity;

let amqpGateway = new AmqpGateway({
  sendTo: "events",
  subscribe: "metrics"
});

require("./lib/deviceMongoDbGateway.js");
mongoInitialize.runMigrations();
var handler = (message) => {
  var request = message.content.toString().trim();
  logger.info("Metrics request received: " + request);
  handlerService.handlePerformanceData(JSON.parse(request))
    .then(() => {
      amqpGateway.acknowledge(message);
    }).bind(this);
};

initializeService.start().then(() => {
  amqpGateway.subscribe(handler);
});

// r.table("Rule").map(function (doc) {
//   return {
//     id: doc("id"),
//     name: doc("name"),
//     deviceId: doc("deviceId"),
//     thresholds: doc("thresholds")
//   };
// }).changes().run().then(function(feed) {
//   feed.each(function(err, change) {
//     if (err) {
//       logger.error(err.toString());
//       logger.error(err.stack);
//       return;
//     }

//     logger.info("Rule thresholds change received");
//     var util = require("util");
//     logger.info(util.inspect(change, {depth: 5}));
//     handlerService.updateThresholds(change);
//   });
// }).error(function(error) {
//   logger.info("Error occurred", {
//     error: error
//   });
// });
