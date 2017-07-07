
"use strict"

var _            = require('itheon-utility').underscore;
var logger       = require('itheon-logger');
var net          = require('net');
var BaseEntity   = require('itheon-entity').BaseEntity;
var ServiceError = require('itheon-service').ServiceError;

class TCPSender
{
  /**
   * Method generates an Itheon 10 event object and writes it to the database
   * @param Event details Event entity
   * @param Object settings  expected:
   * {
   *   "eventType": "problem",
   *   "endpoint": 'http://10.187.76.104/api/alerts'
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
     this.settings = subscriber.settings;
     this.createClient();

     var payload = details;
     if (this.settings.payload) {
       payload = this.subscriberService.parse(this.settings.payload, this.details);
       delete this.settings.payload;
     }

     return this.sendData(payload);
   }

  /*
  *
  */
  createClient()
  {
    var that = this;
    this.client = new net.Socket({allowHalfOpen: true});

    this.client.connect(this.settings.port, this.settings.host, function() {
      logger.info('Connected to ' + that.settings.host + ':' + that.settings.port);
    });

    this.client.on('data', function(data) {
      logger.silly('Data received: ' + data);
      var pattern = new RegExp(that.settings.testSuccess);

      if(pattern.test(data) || Buffer.byteLength(data, 'utf8') == 0) {
        logger.info('Successful response recieved.');
        return;
      }

      logger.info('Failed resending event: ' + that.details.originalEvent);
      that.subscriberService.retry(that.details, that.subscriber);
    });

    this.client.on('close', function() {
      logger.info('Connection closed.');
    });

    //Handle TCP error's gracefully
    this.client.on('error', function(ex) {
      logger.error('Error in TCP connection: ', ex);
      //Check if we should retry
      that.subscriberService.retry(that.details, that.subscriber);
      that.client.destroy();
    });
}

  /**
   * Post alert to the ItheonX API
   *
   * @return Result result Result object of if the API call was successful or not
   */
  sendData(data)
  {
    logger.info('Sending data: ', data);
    this.client.write(data);
    this.client.end();
    var that = this;
    this.client.setTimeout(this.settings.timeout * 1000, function() {
      logger.error('Socket timed out after: ' + that.settings.timeout + ' seconds.');
      that.subscriberService.retry(that.details, that.subscriber);
      that.client.destroy();
    });
    return true;
  }
}

module.exports = TCPSender;
