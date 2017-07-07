
"use strict";

var config            = require("itheon-config").ConfigFactory.getConfig();
var logger            = require("itheon-logger");
var _                 = require("itheon-utility").underscore;
var DataProviderError = require("./dataProviderError");

class AmqpDataProvider
{
  /**
   * Custom constructor allows to set queue name
   *
   * @param string queueName Queue name
   */
  constructor(queues)
  {
    this.queues = {};
    this.queueOptions = {};
    this.setQueues(queues);
  }

  getQueueOptions() {
    return this.queueOptions;
  }

  setQueueOptions(options) {
    var invalid = _.find(_.keys(options), function(key) {
      return !_.contains(['durable', 'exclusive', 'noAck', 'autoDelete'], key);
    });

    if(invalid) {
      throw new DataProviderError(
        'Failed to set queue options invalid option(s) used'
      );
    }

    this.queueOptions = options;
    return this;
  }

  /**
   * Method sets queue name
   *
   * @param string queueName Queue name
   * @return self this Fluent interface
   */
  setQueues(queues)
  {
    _.extend(this.queues, queues);
    return this;
  }

  /**
   * Method sends message to queue
   *
   * @param string message Messsage to be send to queue
   * @return Promise promise of queue response or rejection
   */
  sendToQueue(message)
  {
    if (_.isObject(message)) {
      message = JSON.stringify(message);
    }

    if (!_.isString(message)) {
      throw new DataProviderError(
        'Invalid message passed to be saved to queue. Entity or string expected'
      );
    }

    logger.info(
      'Queue: Upserting message into ' + this.queues.sendTo + ' queue.', message
    );

    if (!this.open) {
      this.lazyConnect();
    }

    var that = this;

    if (this.channel) {
      return new Promise(function(resolve, reject) {
        resolve(that.channel.sendToQueue(that.queues.sendTo, new Buffer(message)));
      });
    }

    return new Promise(function(resolve, reject) {
      return that.open.then(function(connection) {
        return connection.createChannel();
      }).then(function(channel) {
        that.channel = channel;
        that.channel.assertQueue(that.queues.sendTo, that.queueOptions);
        resolve(that.channel.sendToQueue(that.queues.sendTo, new Buffer(message)));
      });
    });
  }

  subscribe(handler)
  {
    if (!_.isString(this.queues.subscribe)) {
      throw new DataProviderError(
        'Subscription queue name not set. String expected'
      );
    }

    if (!_.isFunction(handler)) {
      throw new DataProviderError(
        'Invalid handler function passed. Function expected'
      );
    }

    if (!this.open) {
      this.lazyConnect();
    }

    if (this.channel) {
      return new Promise(function(resolve, reject) {
        this.channel.assertQueue(this.queues.subscribe, this.queueOptions);
        resolve(this.channel.consume(this.queues.subscribe, handler));
      }.bind(this));
    }

    return this.open.then(function(connection) {
      return connection.createChannel();
    }).then(function(channel) {
      this.channel = channel;
      let prefetch = config.get('amqp:prefetch');
      if (prefetch) {
        this.channel.prefetch(prefetch);
      }
      this.channel.assertQueue(this.queues.subscribe, this.queueOptions);
      return this.channel.consume(this.queues.subscribe, handler);
    }.bind(this));
  }

  acknowledge(message)
  {
    this.channel.ack(message);
  }

  unacknowledge(message)
  {
    this.channel.nack(message);
  }

  lazyConnect()
  {
    this.open = require('amqplib').connect(config.get('amqp:connectionString'));
  }
}

module.exports = new AmqpDataProvider();
