
"use strict";

var appRootPath              = require("app-root-path");
var ReminderEntity           = require("itheon-module-reminder-entity").ReminderEntity;
var ReminderCollectionEntity = require("itheon-module-reminder-entity").ReminderCollectionEntity;
const common                 = require("opserve-common");
const _                      = common.utilities.underscore;
const ItheonError            = common.error.BaseError;
const Request                = common.Request;

/**
 * Reminders service class definition
 */
class RemindersService
{
  constructor(reminderGateway, gatewayType)
  {
    this.setGateway(reminderGateway, gatewayType);
  }

  setGateway(reminderGateway, gatewayType)
  {
    if (!reminderGateway) {
      var RemindersGateway = require("../gateway/reminder/rethinkDbReminderGateway");
      reminderGateway = new RemindersGateway();
    }

    this.reminderGateway = reminderGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/reminders
  */
  getSchema()
  {
    var reminderEntity = new ReminderEntity();
    return {
      "reminder": reminderEntity.getFields()
    };
  }

  /**
   * Method gets all reminders matching passed request
   * @param  {[type]}   request    [description]
   * @return Promise results Promise of gateway's results
   */
  find(request)
  {
    request = request || new Request();
    request.appendConditions({status: 1});
    var that = this;
    return this.reminderGateway.fetchAll(request)
      .then(function(collection) {
        var remindersCollectionEntity = new ReminderCollectionEntity();
        remindersCollectionEntity.setAllowAnyField(true);
        return remindersCollectionEntity.inflate(collection);
      }).then(function(remindersCollectionEntity) {
        request.disableLimit();
        request.enableCount();
        return that.reminderGateway.fetchAll(request)
          .then(function(totalNumberOfReminders) {
            return remindersCollectionEntity.setTotalCount(totalNumberOfReminders);
          });
      });
  }

  /**
   * Method creates the passed data using gateway with inflated
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  create(data)
  {
    var reminderEntity = this.validateData(data);

    return this.reminderGateway.create(reminderEntity)
      .then(function (reminderData) {
        if (reminderData.errorCode) {
          throw new ItheonError(
            reminderData.message,
            reminderData.data,
            reminderData.errorCode
          );
        }

        return new ReminderEntity(reminderData);
      });
  }

  /**
   * Method update the passed data using gateway with inflated
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  update(data)
  {
    var reminderEntity = this.validateData(data);

    return this.reminderGateway.update(reminderEntity)
      .then(function (reminderData) {
        if (reminderData.errorCode) {
          throw new ItheonError(
            reminderData.message,
            reminderData.data,
            reminderData.errorCode
          );
        }

        return new ReminderEntity(reminderData);
      });
  }

  /**
   * Method delete the passed data using gateway with inflated
   * entity
   *
   * @param  {[type]}   data     [description]
   * @return {[type]}            [description]
   */
  delete(id)
  {
    return this.reminderGateway.delete(id);
  }

  /**
   * Method checks data for create/update method
   *
   * @param object data Object with data
   */
  validateData(data)
  {
    if (!_.isObject(data)) {
      throw new ItheonError(
        "Invalid data provided. Object describing entity properties expected.",
        {
          data: data
        }
      );
    }

    return new ReminderEntity(data);
  }
}

module.exports = RemindersService;
