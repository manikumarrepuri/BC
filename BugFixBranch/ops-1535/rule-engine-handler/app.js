"use strict"

var appRootPath = require('app-root-path');
const common = require('opserve-common');
const _ = common.utilities.underscore;
const logger = common.logger;
const config = common.Config.get();
const AmqpGateway = common.gateway.AmqpQueueGateway;

var net = require('net');

var AlertEntity = require('itheon-module-alert-entity').AlertEntity;
var SubscriberService = require('itheon-subscriber').SubscriberService;
var subscriberService = new SubscriberService();

var amqpGateway = new AmqpGateway({
  subscribe: "events"
});

var run = function () {
  try {
    amqpGateway.subscribe(function (message) {
      var request = message.content.toString().trim();
      var alert = JSON.parse(request);
      logger.info("Events request received: " + request);

      try {
        //Loop through subscriber and process request
        _.each(alert.subscribers, function (subscriber, index) {
          logger.info('Processing subscriber: ', {
            subscriber: subscriber
          });
          subscriberService.handleSubscribers(alert, subscriber);
        });
        amqpGateway.acknowledge(message);
      } catch (error) {
        logger.error('Processing error subscriber: ' + message, error);
        amqpGateway.unacknowledge(message);
      }
    });
  } catch (error) {
    logger.error('Handler critical error, retrying after 5 seconds.', error);
    setTimeout(run, 5000);
  }
};

run();
