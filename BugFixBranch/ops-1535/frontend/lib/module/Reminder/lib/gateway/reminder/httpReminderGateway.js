
"use strict";

const common                  = require("opserve-common");
const HttpGateway             = common.gateway.HttpGateway;
const config                  = common.Config.get();
const ItheonError             = common.error.BaseError;
var ReminderEntity           = require("itheon-module-reminder-entity").ReminderEntity;
var ReminderCollectionEntity = require("itheon-module-reminder-entity").ReminderCollectionEntity;

class HttpReminderGateway extends HttpGateway
{
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrl = "/reminders";
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
        let reminderCollectionEntity = new ReminderCollectionEntity(response.body);
        reminderCollectionEntity.setTotalCount(response.headers["x-total-count"]);
        return reminderCollectionEntity;
      });
  }

  create(reminderEntity)
  {
    if (!(reminderEntity instanceof ReminderEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of ReminderEntity expected");
    }

    return super.insert(reminderEntity)
      .then(function(reminderData) {
        return new ReminderEntity(reminderData);
      });
  }

  update(reminderEntity)
  {
    if (!(reminderEntity instanceof ReminderEntity)) {
      throw new ItheonError("Invalid entity passed. Instance of ReminderEntity expected");
    }

    if (!reminderEntity.getId()) {
      throw new ItheonError("Invalid logic. Insert should be called");
    }

    return super.update(reminderEntity)
      .then(function(reminderData) {
        return new ReminderEntity(reminderData);
      });
  }
}

module.exports = HttpReminderGateway;
