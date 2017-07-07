
"use strict"

var _      = require('itheon-utility').underscore;
var moment = require('moment');
var fs     = require('fs');
var logger = require('itheon-logger');

var AlertEntity  = require('itheon-module-alert-entity').AlertEntity;
var ServiceError = require('itheon-service').ServiceError;

class ItheonEvent
{
  /**
   * Method generates an Itheon 7.1 event object and writes it out to a .evt file
   * @param Event details Event entity
   * @param Object settings  expected:
   * {
   *   "eventType": "7",
   *   "fileName": 'itheon_problem_events_{datetime}.evt'
   * }
   */
  processEvent(details, subscriber, subscriberService)
  {

    if (!_.isObject(details)) {
      throw new ServiceError(
        'Invalid event passed. Instance of Event expected',
        {
          details: details
        }
      );
    }

    this.details = details;
    this.subscriber = _.clone(subscriber);
    this.subscriberService = subscriberService;
    var settings = subscriber.settings;

    this.fileName = settings.fileName.replace('{datetime}', moment(new Date()).format('YYYY_M_D'));
    this.type = settings.eventType;

    this.event = this.createEventObject();

    return this.writeFile();
  }

  /**
   * Method generates an Itheon event object
   *
   * @return Result result Result object containing code and severity if it was
   * successful
   */
  createEventObject()
  {
    var event = this.details;
    var context = event.group + ':' + event.name;
    context += (!event.entity) ? "" : "|" + event.entity;

    return {
      type: this.type,
      valid: 1,
      host:event.name,
      date: moment(event.lastOccurrence,'X').format("DD-MMM-YYYY"),
      time: moment(event.lastOccurrence,'X').format("HH:mm:ss"),
      state:event.state,
      class: event.ruleName,
      subClass: '',
      severity:event.severity,
      handle: 0,
      handleName:event.ruleName,
      context : context,
      creationDate: moment(event.firstOccurrence,'X').format("DD-MMM-YYYY"),
      creationTime: moment(event.firstOccurrence,'X').format("HH:mm:ss"),
      closeDate: (event.state != "C") ? '' : moment(event.lastOccurrence,'X').format("DD-MMM-YYYY"),
      closeTime: (event.state != "C") ? '' : moment(event.lastOccurrence,'X').format("HH:mm:ss"),
      updateCount:event.occurrences,
      owner: 'ItheonX',
      brief:event.brief,
      fullText:event.fullText
    }
  }

  /**
   * Method converts an object into an array
   *
   * @param object obj Ithen event object
   * @return array array an array with object
   * successful
  */
  convertObjtoArray(obj)
  {
    var array = [];
    Object.keys(obj).forEach(function(key) {
      array.push(obj[key]);
    });

    return array;
  }

  /**
   * Method to write our object to a file
   *
   * @return bool or error if the file cant be saved
   * successful
  */
  writeFile()
  {
    logger.info(
      'Saving event to file ' + this.fileName
    );

    try {
      fs.appendFileSync(this.fileName, this.convertObjtoArray(this.event).join('#')+'##'+"\n");
    } catch(err) {
      this.subscriberService.retry(this.details, this.subscriber);
      logger.error('Failed saving Itheon event file: ', err);
    }

    return true;
  }

  removeFile()
  {
    fs.unlinkSync(this.fileName);
  }
}

module.exports = ItheonEvent;
