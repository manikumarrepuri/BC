
"use strict";

var ScheduledReminderEntity           = require("itheon-module-reminder-entity").ScheduledReminderEntity;
const common                          = require("opserve-common");
const _                               = common.utilities.underscore;
const ItheonError                     = common.error.BaseError;
const Request                         = common.Request;

/**
 * ScheduledReminders service class definition
 */
class ScheduledRemindersService
{
  constructor(scheduledRemindersGateway, gatewayType)
  {
    this.setGateway(scheduledRemindersGateway, gatewayType);
  }

  setGateway(scheduledRemindersGateway, gatewayType)
  {
    if (!scheduledRemindersGateway) {
      var ScheduledRemindersGateway = require("../gateway/scheduledReminder/httpScheduledReminderGateway");
      scheduledRemindersGateway = new ScheduledRemindersGateway();
    }

    this.scheduledRemindersGateway = scheduledRemindersGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/rules
  */
  getSchema()
  {
    var scheduledReminderEntity = new ScheduledReminderEntity();
    return {
      "scheduledReminder": scheduledReminderEntity.getFields()
    };
  }

  /**
   * Method gets all scheduledReminders matching passed request
   * @param  {[type]}   request    [description]
   * @return Promise results Promise of mapper"s results
   */
  find(request)
  {
    request = request || new Request();
    var conditions = request.getConditions();
    conditions.status = 1;
    request.setConditions(conditions);

    return this.scheduledRemindersGateway.fetchAll(request)
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
    var scheduledReminderEntity = this.validateData(data);

    return this.scheduledRemindersGateway.create(scheduledReminderEntity)
      .then(function (scheduledReminderData) {
        if(scheduledReminderData.errorCode) {
          throw new ItheonError(
            scheduledReminderData.message,
            scheduledReminderData.data,
            scheduledReminderData.errorCode
          );
        }

        return new ScheduledReminderEntity(scheduledReminderData);
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
    var scheduledReminderEntity = this.validateData(data);

    return this.scheduledRemindersGateway.update(scheduledReminderEntity)
      .then(function (scheduledReminderData) {
        if(scheduledReminderData.errorCode) {
          throw new ItheonError(
            scheduledReminderData.message,
            scheduledReminderData.data,
            scheduledReminderData.errorCode
          );
        }

        return new ScheduledReminderEntity(scheduledReminderData);
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
    return this.scheduledRemindersGateway.delete(id);
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

    return new ScheduledReminderEntity(data);
  }
}

module.exports = ScheduledRemindersService;
