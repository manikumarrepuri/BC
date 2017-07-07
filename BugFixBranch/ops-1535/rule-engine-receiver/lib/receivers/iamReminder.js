"use strict"

var appRoot        = require('app-root-path');
var common         = require('opserve-common');
var _              = common.utilities.underscore;
const logger       = common.logger;
const HttpGateway    = common.gateway.HttpGateway;
const ReceiverError  = common.error.ReceiverError;
var moment         = require('moment');
var Service        = require('itheon-service');
var ReminderEntity = require("itheon-module-reminder-entity").ReminderEntity;

class iamReminder extends Service {
  /**
   *
   */
  constructor() {
    super();
    this.config = common.Config.get();
    this.httpGateway = new HttpGateway(null, this.config.get("backend-api"));
  }

  /**
   * Generate a Performance entity using a mapper
   *
   * @param Object data
   * {
   *   "mapperName": "",
   *   "mapper": {
   *               fields: {
   *                 "name": "physicalMemoryUsed",
   *                 "type": "%"
   *               }
   *             },
   *   "columns": [],
   * }
   * @return Performance entity
   */
  generateEntity(data) {
    //Load the mapper and create the metrics array
    var id = null,
      time = null,
      date = null;
    var details = {};
    _.each(data.columns, function (value, index) {
      if (typeof data.mapper.fields[index] !== 'undefined') {
        switch (data.mapper.fields[index].name) {
        case 'host':
          details["deviceId"] = value;
          break;

        case 'briefText':
          var group = {
            name: "BAU"
          };

          if (/\b([t|T]apes?|[o|O]pt(ion)?\s?21|[b|B]ackups?)\b/.test(value)) {
            group.name = "Backups";
          } else if (/\b[r|R]eports?\b/.test(value)) {
            group.name = "Reports";
          }

          details["group"] = group;
          details["briefText"] = value.replace(/(([N|n]ovo [R|r]ef(erence)?\s?:?\s)?([A-Za-z]{3,4}[0-9]{3,4}))/, "<a href='#' ng-click='ctrl.postNovo(\"$4\")'>$1</a>");
          break;

        case 'fullText':
          details["fullText"] = value.replace(/(([N|n]ovo [R|r]ef(erence)?\s?:?\s)?([A-Za-z]{3,4}[0-9]{3,4}))/, "<a href='#' ng-click='ctrl.postNovo(\"$4\")'>$1</a>");
          break;

        case 'handleName':
          details['name'] = value;
          break;

        case 'problemOwner':
          if (value == "itheonadmin") {
            value = "admin";
          }

          details["assignedResource"] = {
            "username": value
          };
          break;

        default:
          details[data.mapper.fields[index].name] = value;
          break;
        }
      }
    });

    if (!details) {
      throw new ReceiverError(
        'Invalid request. No reminder details generated.'
      );
    }

    return details;
  }

  /**
   * Method sends a post request to the frontend api
   *
   * @param reminderEntity reminderEntity Reminder entity
   * @return reminderEntity reminder Reminder entity
   */
  process(reminder) {
    reminder.createdAt = new Date();
    reminder.status = 1;
    reminder.state = {
      "name": "New"
    };

    logger.info(
      'iamReminder Receiver: Posting reminder entity to API'
    );

    //Below code would not work as Reminders api is not yet ready, commenting the below lines of code
    //TO DO : This needs to be un-commented once the Reminder's Api is ready.
    // this.httpGateway.setUrl('/api/reminders');
    // this.httpGateway.insert(reminder);

    return reminder;
  }
}

module.exports = iamReminder;
