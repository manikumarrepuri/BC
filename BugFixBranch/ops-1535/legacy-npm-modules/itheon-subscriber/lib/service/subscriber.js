"use strict"

var _                = require('itheon-utility').underscore;
var logger           = require('itheon-logger');
var BaseEntity       = require('itheon-entity').BaseEntity;
var ServiceError     = require('itheon-service').ServiceError;
var SubscriberMapper = require('./../config/subscribers');
var Subscribers      = require('require-all')(__dirname + '/../subscribers');
var Handlebars       = require("itheon-utility").handlebars;

class SubscriberService
{
  /**
   * Main method to be called to handle incoming event entity
   *
   * @return Promise result Promise of statup result
   */
  handleSubscribers(data, subscriber)
  {
    if (!_.isObject(data)) {
      logger.error('Invalid event passed. Object expected, actual data passed: ' + data + "\n Subscriber: ", subscriber);
      throw new ServiceError(
        'Invalid event passed. Object expected'
      );
    }

    logger.info(
      'SubscriberService: Handling incoming alert for: ',
      {
        subscriber: subscriber
      }
    );

    // check that the subscriber file exists
    try {
      var subscriberType = subscriber;
      var settings = null;
      if (_.isObject(subscriber)) {
        var subscriberName = subscriber.name || Object.keys(subscriber)[0];

        if(subscriber.settings) {
          subscriberType = subscriber.name;
          settings = subscriber.settings;
          subscriber = {[subscriberName]: _.clone(subscriber)};
        }
        else {
          subscriber = {[subscriberName]: _.clone(subscriber[subscriberName])};
          subscriberType = subscriber[subscriberName].name;
          settings = subscriber[subscriberName].settings;
        }
      } else {
        subscriber = {};
      }

      // Overwrite base settings if need be.
      var subscriberConfig = _.clone(SubscriberMapper[subscriberType]);
      if (!subscriberConfig) {
        throw new ServiceError(
          'Subscriber ' + subscriberType + ' not found.'
        );
      }

      subscriber.settings = _.extend(_.clone(subscriberConfig.settings), settings);

      var subscriberHandler = new Subscribers[subscriberConfig.type]();
      if (!subscriberHandler.processEvent(data, subscriber, this)) {
        throw new ServiceError(
          'Unknown error processing subscriber: ',{
            subscriberType: subscriberConfig.type
          }
        );
      }
    } catch (e) {
      logger.error("There was an error attempting to handle subscribers: " + e.message, e);
      throw e;
    }
  }

  parse(payload, details)
  {
    let result = {};

    if (_.isString(payload)) {
      let cTemplate = Handlebars.compile(payload);
      result = cTemplate(details);
    }

    if (_.isObject(payload))
    {
      let string = JSON.stringify(payload);
      let cTemplate = Handlebars.compile(string);
      string = cTemplate(details);
      result = JSON.parse(string);
    }

    return result;
  }

  retry(details, subscriber)
  {
    try {
      var subscriberName = Object.keys(subscriber)[0];
      // Check if we should retry or call error
      if (subscriber[subscriberName].settings.retry) {
        subscriber = {[subscriberName]: _.clone(subscriber[subscriberName]) };
        subscriber[subscriberName].settings.retry--;
        details.subscribers = _.clone(subscriber);
      } else {
        if (!subscriber.settings.onError) {
          logger.error('Attempt to retry failed no subscriber found.');
          return false;
        }
        if (!_.isObject(subscriber.settings.onError)) {
          details.subscribers = subscriber.settings.onError;
        } else {
          details.subscribers = _.clone(subscriber.settings.onError);
        }
      }

      this.handleSubscribers(details, details.subscribers);
      return true;
    } catch(err) {
      if (!_.isObject(details)) {
        logger.error('Details is not an object');
        return false;
      }

      if (_.isString(err)) {
         details.errorText = err;

         return false;
       }
       details.errorText = err.message;
    }
    return false;
  }
}

module.exports = SubscriberService;
