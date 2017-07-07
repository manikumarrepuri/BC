
"use strict"

var _            = require('itheon-utility').underscore;
var logger       = require('itheon-logger');
var soap         = require('soap-as-promised');
var BaseEntity   = require('itheon-entity').BaseEntity;
var ServiceError = require('itheon-service').ServiceError;

class SOAP
{
  /**
   * Method generates a SOAP call
   * @param Event details Event entity
   * @param Object settings  expected:
   * {
   *   "wsdl": "problem",
   *   "method": "someFunction",
   *   "options": {},
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

     // Check for a valid url
    /* var pattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/g;
     if (!pattern.test(settings.wsdl)) {
       this.subscriberService.retry(this.details, this.subscriber);
       throw new ServiceError(
         'Invalid settings passed. A valid URL is needed to send a SOAP request.'
       );
     }*/

     var payload = _.clone(details);
     if (settings.payload) {
       payload = {};
       payload = this.subscriberService.parse(settings.payload, this.details);
       delete settings.payload;
     }

     return this.sendSOAP(payload, settings);
   }

  /**
   * Post alert to the ItheonX API
   *
   * @return Result result Result object of if the API call was successful or not
   */
  sendSOAP(data, settings)
  {
    logger.info('Sending SOAP request to: ' + settings.wsdl);
    logger.silly('Payload ', data);

    var that = this;
    return soap.createClient(settings.wsdl, settings.options)
        .then((client) => client[settings.method](data))
        .then(function(result) {
          logger.info("SOAP call made succesfully: ", result);
          return true;
        })
        .catch(function(error) {
          logger.error("SOAP called failed", error);
          that.subscriberService.retry(that.details, that.subscriber);
          return false;
        });
  }
}

module.exports = SOAP;
