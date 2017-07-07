"use strict";
const common      = require('opserve-common');
const logger      = common.logger;
const AmqpExchangeGateway = common.gateway.AmqpExchangeGateway;

module.exports = function (server) {
  var io = require("socket.io").listen(server);

  io.on("connection", function (socket) {
    socket.broadcast.emit("connected");

    let alertAmqp = new AmqpExchangeGateway({ name: "AlertFeed", type: "fanout", routingKey: "" });
    alertAmqp.subscribe((message) => {
      socket.emit("alertUpdate", message.content.toString());
    });
  });
};
