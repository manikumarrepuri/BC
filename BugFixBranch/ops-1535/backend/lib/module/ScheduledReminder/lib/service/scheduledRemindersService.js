
"use strict";

var appRootPath                       = require("app-root-path");
var ScheduledReminderEntity           = require("itheon-module-reminder-entity").ScheduledReminderEntity;
var ScheduledReminderCollectionEntity = require("itheon-module-reminder-entity").ScheduledReminderCollectionEntity;
const common                          = require("opserve-common");
const _                               = common.utilities.underscore;
const ItheonError                     = common.error.BaseError;
const Request                         = common.Request;

/**
 * ScheduledReminders service class definition
 */
class ScheduledRemindersService
{
  constructor(scheduledReminderGateway, gatewayType)
  {
    this.setGateway(scheduledReminderGateway, gatewayType);
  }

  setGateway(scheduledReminderGateway, gatewayType)
  {
    if (!scheduledReminderGateway) {
      var ScheduledRemindersGateway = require("../gateway/scheduledReminder/rethinkDbScheduledReminderGateway");
      scheduledReminderGateway = new ScheduledRemindersGateway();
    }

    this.scheduledReminderGateway = scheduledReminderGateway;
  }

  /**
  * Method returns the entity fields
  * @return Object entity fields/scheduledReminders
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
   * @return Promise results Promise of gateway's results
   */
  find(request)
  {
    request = request || new Request();
    request.appendConditions({status: 1});
    var that = this;
    return this.scheduledReminderGateway.fetchAll(request)
      .then(function(collection) {
        var scheduledRemindersCollectionEntity = new ScheduledReminderCollectionEntity([], ScheduledReminderEntity);
        scheduledRemindersCollectionEntity.setAllowAnyField(true);
        return scheduledRemindersCollectionEntity.inflate(collection);
      }).then(function(scheduledRemindersCollectionEntity) {
        request.disableLimit();
        request.enableCount();
        return that.scheduledReminderGateway.fetchAll(request)
          .then(function(totalNumberOfScheduledReminders) {
            return scheduledRemindersCollectionEntity.setTotalCount(totalNumberOfScheduledReminders);
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
    var scheduledReminderEntity = this.validateData(data);

    return this.scheduledReminderGateway.create(scheduledReminderEntity)
      .then(function (scheduledReminderData) {
        if (scheduledReminderData.errorCode) {
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

    return this.scheduledReminderGateway.update(scheduledReminderEntity)
      .then(function (scheduledReminderData) {
        if (scheduledReminderData.errorCode) {
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
    return this.scheduledReminderGateway.delete(id);
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
