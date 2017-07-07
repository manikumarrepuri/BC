
"use strict";

var common      = require('opserve-common');
var AmqpGateway = common.gateway.AmqpQueueGateway;
var _           = common.utilities.underscore;
const logger    = common.logger;
var BaseService = require("itheon-service").BaseService;

class EventService extends BaseService
{

  /**
   * Custom constructor allows to set gateways
   *
   * @param object gateways List of gateways to assign
   * keys (db, memory and cache)
   */
  constructor(gateways)
  {
    super();

    if (!gateways) {
      gateways = {};
    }

    if (!gateways.hasOwnProperty("queue")) {
      gateways.queue = new AmqpGateway({ sendTo: "events" });
    }

    this.setGateways(gateways);
  }

  /**
   * Method stores events
   *
   * @param object events List of events
   * @return Promise result Promise of returning list of events
   * (push forward for further usage)
   */
  save(events)
  {
    logger.info(
      "EventsService: Upserting event into " + this.getGatewayName(),
      events
    );

    if (!_.isArray(events)) {
      events = [events];
    }

    return Promise.all(events.map(function(event) {

      logger.info(
        "EventsService: Storing event " +
        event.group + ":" + event.name +
        " into " + this.getGatewayName(),
        event
      );

      return this.getGateway().save(event);

    }.bind(this))).then(function() {

      logger.info(
        "EventsService: Saving events into " +
        this.getGatewayName() + " finished"
      );

      return events;

    }.bind(this));
  }
}

module.exports = EventService;
