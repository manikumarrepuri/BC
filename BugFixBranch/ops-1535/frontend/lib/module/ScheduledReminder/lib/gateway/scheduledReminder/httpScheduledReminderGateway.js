"use strict";

const common                          = require("opserve-common");
const config                          = common.Config.get();
const HttpGateway                     = common.gateway.HttpGateway;
const ItheonError                     = common.error.BaseError;
var ScheduledReminderEntity           = require("itheon-module-reminder-entity").ScheduledReminderEntity;
var ScheduledReminderCollectionEntity = require("itheon-module-reminder-entity").ScheduledReminderCollectionEntity;

class HttpScheduledReminderGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/scheduled-reminders";
  }

  /**
   * Method fetches all records matching passed request criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of data from DB
   */
  fetchAll(request)
  {
    return super.fetchAll(request)
      .then(function(response) {
        let scheduledReminderCollectionEntity = new ScheduledReminderCollectionEntity(response.body, ScheduledReminderEntity);
        scheduledReminderCollectionEntity.setTotalCount(response.headers["x-total-count"]);
        return scheduledReminderCollectionEntity;
      });
  }

  create(scheduledReminderEntity)
  {
    if (!(scheduledReminderEntity instanceof ScheduledReminderEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of ScheduledReminderEntity expected");
    }

    return super.insert(scheduledReminderEntity)
      .then(function(scheduledReminderData) {
        return new ScheduledReminderEntity(scheduledReminderData);
      });
  }

  update(scheduledReminderEntity)
  {
    if (!(scheduledReminderEntity instanceof ScheduledReminderEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of ScheduledReminderEntity expected");
    }

    if (!scheduledReminderEntity.getId()) {
      throw new ItheonError("Invalid logic. Insert should be called");
    }

    return super.update(scheduledReminderEntity)
      .then(function(scheduledReminderData) {
        return new ScheduledReminderEntity(scheduledReminderData);
      });
  }
}

module.exports = HttpScheduledReminderGateway;
