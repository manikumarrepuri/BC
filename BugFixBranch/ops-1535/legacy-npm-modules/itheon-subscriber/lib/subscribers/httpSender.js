
"use strict"

var _             = require('itheon-utility').underscore;
var logger        = require('itheon-logger');
var request       = require('request');
var config        = require("itheon-config").ConfigFactory.getConfig();
var BaseEntity    = require('itheon-entity').BaseEntity;
var ServiceError  = require('itheon-service').ServiceError;

class httpSender
{
  /**
   * Method sends an email
   * @param Event details Event entity
   * @param Object settings  expected:
   * https://github.com/request/
   */
  processEvent(details, subscriber, subscriberService)
  {
    if (!_.isObject(details)) {
      throw new ServiceError(
        'Invalid event passed. Instance of Event expected'
      );
    }

    this.subscriber = _.clone(subscriber);
    this.details = details;
    this.subscriberService = subscriberService;
    var settings = _.clone(this.subscriber.settings);

    // Check for a valid url
    /*var pattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/g;
    if (!pattern.test(settings.url)) {
      that.subscriberService.retry(that.details, that.subscriber);
      throw new ServiceError(
        'Invalid settings passed. A valid URL is needed to send a webhook.'
      );
    }*/

    var payload = details;
    if (settings.payload) {
      payload = this.subscriberService.parse(settings.payload, details);
      delete settings.payload;
    }

    return this.sendHTTPRequest(payload, settings);
  }

  /**
   * Send a HTTP Request
   *
   * @return Result result Result object of if the API call was successful or not
   */
  sendHTTPRequest(payload, settings)
  {

    //We might need to parse the URL
    this.details.itheon10 = config.get('frontendApi:protocol') + config.get('frontendApi:host');
    settings.url = this.subscriberService.parse(settings.url, this.details);

    switch(settings.method.toUpperCase()) {
      case "PATCH":
        settings.body = payload;
        break;
      case "POST":
        // If we have json data then stringify it
        if (settings.json) {
          payload = JSON.stringify(payload);
        }
        settings.form = payload;
        break;
    }

    delete settings.retry;
    delete settings.onError;

    logger.info('Sending HTTP request to: ' + settings.url);
    logger.silly('Payload ', settings);

    var that = this;
    return request(settings, function (error, response, body) {
      if (!error && response && response.statusCode === 200) {
        logger.info('Http request successfully sent.')
      } else {
        logger.error("Failed to send the HTTP Request ", error);
        if(response) {
          logger.silly("Response Headers: ", response.headers);
          logger.silly("Response Body: ", response.body);
        }
        that.subscriberService.retry(that.details, that.subscriber);
      }
    })
  }
}

module.exports = httpSender;
