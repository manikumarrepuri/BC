
"use strict";

var appRoot      = require('app-root-path');
var _            = require('itheon-utility').underscore;
var GatewayError = require('./gatewayError');
var BaseGateway  = require('./baseGateway');

class AmqpGateway extends BaseGateway
{
  constructor(queueConnection, queues)
  {
    super();

    if (!_.isObject(queues)) {
      throw new GatewayError(
        'No queue name provided, unable to proceed.',
        {
          queues: queues
        }
      );
    }

    if (!queueConnection) {
      var queueConnection = require('itheon-data-provider').amqpDataProvider;
    }

    this.setQueueConnection(queueConnection);
    this.queueConnection.setQueues(queues);
  }

  /**
   * Method sets queues
   *
   * @param object queues List of queue names
   * @return self this Fluent interface
   */
  setQueues(queues)
  {
    this.queueConnection.queues = queues;
    return this;
  }

  setQueueConnection(queueConnection)
  {
    this.queueConnection = queueConnection;
  }

  save(message)
  {
    return this.queueConnection.sendToQueue(message);
  }

  subscribe(handler, depreciated)
  {
    if (typeof depreciated === "function") {
      console.warn("Deprecated: Please start to use handler only with subscribe function");
      handler = depreciated;
    }

    return this.queueConnection.subscribe(handler);
  }

  acknowledge(message)
  {
    return this.queueConnection.acknowledge(message);
  }

  unacknowledge(message)
  {
    return this.queueConnection.unacknowledge(message);
  }
}

module.exports = AmqpGateway;
