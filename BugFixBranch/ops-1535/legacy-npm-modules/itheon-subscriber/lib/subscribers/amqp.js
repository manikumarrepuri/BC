
"use strict"

var _            = require('itheon-utility').underscore;
var logger       = require('itheon-logger');
var BaseEntity   = require('itheon-entity').BaseEntity;
var ServiceError = require('itheon-service').ServiceError;

class AMQP
{
  /**
   * Method generates a AMPQ call
   * @param Event details Event entity
   * @param Object settings  expected:
   * {
   *   "url": "problem",
   *   "queue": "events",
   *   "payload": {
   *     "some data"
   *   }
   * }
   */
   processEvent(details, subscriber, subscriberService)
   {
     if (!details) {
       throw new ServiceError(
         'Invalid event passed. Instance of Event expected'
       );
     }

     this.details = details;
     this.subscriber = _.clone(subscriber);
     this.subscriberService = subscriberService;
     var settings = _.clone(this.subscriber.settings);
     var payload = _.clone(details);
     if (settings.payload) {
       payload = null;
       payload = this.subscriberService.parse(settings.payload, this.details);
       delete settings.payload;
     }

     return this.sendAMQP(payload, settings);
   }

  /**
   * Post alert to the ItheonX API
   *
   * @return Result result Result object of if the API call was successful or not
   */
  sendAMQP(data, settings)
  {
    logger.info('Sending to queue: ' + settings.queue);
    logger.silly('Payload ', data);

    var open = require('amqplib').connect(settings.url);
    var that = this;

    return open.then(function(conn) {
      var ok = conn.createChannel();
      ok = ok.then(function(ch) {
        ch.assertQueue(settings.queue);
        ch.sendToQueue(settings.queue, new Buffer(JSON.stringify(data)))
        return ch.close();
      })
      .ensure(function() {
        conn.close();
      });
      logger.info('Successfully sent to: ' + settings.queue + ' queue');
      return ok;
    }).then(null, function(err) {
      logger.error("Failed to save to queue", err);
      that.subscriberService.retry(that.details, that.subscriber);
      return false;
    });
  }
}

module.exports = AMQP;
