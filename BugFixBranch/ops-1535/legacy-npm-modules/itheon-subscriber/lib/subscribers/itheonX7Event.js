
"use strict"

var _       = require('itheon-utility').underscore;
var request = require('request');
var logger  = require('itheon-logger');

var AlertEntity  = require('itheon-module-alert-entity').AlertEntity;
var ServiceError = require('itheon-service').ServiceError;

class ItheonX7Event
{
  /**
   * Method generates an Itheon 10 event object and writes it to the database
   *
   * @param Event details Alert entity
   * @param Object subscrier expected:
   * {
   *   "eventType": "problem",
   *   "endpoint": 'http://10.187.76.104/api/alerts'
   * }
   */
  processEvent(details, subscriber, subscriberService)
  {
    if (!_.isObject(details)) {
      throw new ServiceError(
        'Invalid event passed. Instance of Event expected'
      );
    }

    this.details = details;
    this.subscriber = _.clone(subscriber);
    this.subscriberService = subscriberService;
    this.settings = subscriber.settings;

    var payload = details;
    if (this.settings.payload) {
      payload = this.subscriberService.parse(this.settings.payload, this.details);
      delete this.settings.payload;
    }

    this.alert = this.createAlertObject(payload);
    return this.postAlert(this.alert);
  }

  /**
   * Method generates an ItheonX event object
   *
   * @return Result result Result object containing code and severity if it was
   * successful
   */
  createAlertObject(payload)
  {
    logger.info('Creating ' + this.settings.eventType + ' alert for ItheonX');

    var originalEvent = payload.split('#');
    var alert = this.details;
    var context = alert.group + ':' + alert.name;

    alert.deviceId = context;
    alert.type = this.settings.eventType;
    alert.resourceUrl = "";
    alert.status = 1;

    if(!alert.entity) {
      alert.entity = null;
    }

    //Override what the rule engine worker said!
    alert.severity = originalEvent[8];
    alert.state = originalEvent[5];
    alert.occurrences = originalEvent[16];
    alert.brief = originalEvent[18];
    alert.fullText = originalEvent[19];
    alert.firstOccurrence = parseInt((new Date(originalEvent[12] + " " + originalEvent[13]).getTime() / 1000).toFixed(0));

    return alert;
  }

  /**
   * Post alert to the ItheonX API
   *
   * @return Result result Result object of if the API call was successful or not
   */
  postAlert(alert)
  {
    if(alert.state == "O"){
      return true;
    }
    var that = this;
    logger.info('Sending request to ItheonX: ' + this.settings.endpoint);

    let options = {
      url: this.settings.endpoint,
      form: alert
    };

    if (this.settings.endpoint.toLowerCase().startsWith("https://")) {
      if (!_.isUndefined(this.settings.strictSSL))
      {
        options["agentOptions"] = {
          "rejectUnauthorized": this.settings.strictSSL
        };
      }  
    }

    return request.post(options,
        function (error, response, body) {
          if(error) {
            logger.error('Failed to send request to ItheonX: ', error);
            that.subscriberService.retry(that.details, that.subscriber);
            return false;
          }

          if (response && (response.statusCode >= 200 && response.statusCode < 300)) {
            logger.info('Successfully updated ItheonX');
            return true;
          }

          logger.error('Failed to send request to ItheonX unknown error');
          return false;
        }
    );
  }
}

module.exports = ItheonX7Event;
