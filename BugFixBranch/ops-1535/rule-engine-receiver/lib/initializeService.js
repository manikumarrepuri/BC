"use strict"

var appRootPath   = require("app-root-path");
const common      = require("opserve-common");
const logger      = common.logger;
var AmqpGateway   = common.gateway.AmqpQueueGateway;

class InitializeService
{
  /**
   * Main method to be called to start receiver instance
   *
   * @return Promise result Promise of statup result
   */
  start(amqpGatewayOverride)
  {
    logger.info("Initialization - Generating AMQP singleton.");
    return new Promise((resolve, reject) => {
      if (amqpGatewayOverride)
      {
        resolve(amqpGatewayOverride);
      } else {
        resolve(new AmqpGateway({ sendTo: "metrics" }));
      }
    });
  }
}

module.exports = InitializeService;
