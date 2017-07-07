
"use strict"

var appRoot       = require('app-root-path');
var _             = require('itheon-utility').underscore;
var moment        = require('moment');
var fs            = require('fs');
var logger        = require('itheon-logger');
var ServiceError  = require('itheon-service').ServiceError;

class File
{
  /**
   * Custom constructor
   */
  constructor() {}

  /**
   * Method generates an Itheon 7.1 event object and writes it out to a .evt file
   * @param Event details Event entity
   * @param Object settings  expected:
   * {
   *   "payload": "some text",
   *   "fileName": 'itheon_problem_events_{datetime}.evt'
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
    var settings = subscriber.settings;
    var payload = _.clone(details);
    if (settings.payload) {
      payload = {};
      payload = this.subscriberService.parse(settings.payload, this.details);
      delete settings.payload;
    }

    //Resolve fileName
    this.fileName = this.subscriberService.parse(settings.fileName, this.details);
    return this.writeFile(payload, details);
  }

  /**
   * Method to write our object to a file
   *
   * @return bool or error if the file cant be saved
   * successful
  */
  writeFile(contents) {
    logger.info(
      'Saving payload to file: ' + this.fileName
    );

    try {
      fs.appendFileSync(this.fileName, contents);
    }
    catch(err) {
      this.subscriberService.retry(this.details, this.subscriber);
      throw new ServiceError(
        'Failed saving payload to file: ' + err
      );
    }

    return true;
  }

  removeFile() {
    fs.unlinkSync(this.fileName);
  }
}

module.exports = File;
