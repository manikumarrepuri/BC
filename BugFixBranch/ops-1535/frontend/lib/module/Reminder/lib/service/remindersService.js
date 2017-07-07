
"use strict";

var ReminderEntity           = require("itheon-module-reminder-entity").ReminderEntity;
const common                 = require("opserve-common");
const _                      = common.utilities.underscore;
const ItheonError            = common.error.BaseError;
const Request                = common.Request;

/**
 * Reminders service class definition
 */
class RemindersService
{
  constructor(remindersGateway, gatewayType)
  {
    this.setGateway(remindersGateway, gatewayType);
  }

  setGateway(remindersGateway, gatewayType)
  {
    if (!remindersGateway) {
      var RemindersGateway = require("../gateway/reminder/httpReminderGateway");
      remindersGateway = new RemindersGateway();
    }

    this.remindersGateway = remindersGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/rules
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
   * @return Promise results Promise of mapper"s results
   */
  find(request)
  {
    request = request || new Request();
    var conditions = request.getConditions();
    conditions.status = 1;
    request.setConditions(conditions);

    return this.remindersGateway.fetchAll(request)
      .then(function(collection) {
        return collection;
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

    return this.remindersGateway.create(reminderEntity)
      .then(function (reminderData) {
        if(reminderData.errorCode) {
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

    return this.remindersGateway.update(reminderEntity)
      .then(function (reminderData) {
        if(reminderData.errorCode) {
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
    return this.remindersGateway.delete(id);
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
