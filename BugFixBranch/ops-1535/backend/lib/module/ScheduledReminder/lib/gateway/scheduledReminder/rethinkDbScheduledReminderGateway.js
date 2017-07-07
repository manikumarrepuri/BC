
"use strict";

var appRootPath               = require("app-root-path");
const common                  = require("opserve-common");
const RethinkDbGateway        = common.gateway.RethinkDbGateway;
const _                       = common.utilities.underscore;
const GatewayError            = common.gateway.GatewayError;
var logger                    = common.logger;
var ScheduledReminderEntity   = require("itheon-module-reminder-entity").ScheduledReminderEntity


class RethinkDbScheduledReminderGateway extends RethinkDbGateway
{
  /**
   * Cutom contractor allows to pass gateway instance
   *
   * @param object gateway Mapper's gateway(i.e. dbConnection)
   */
  constructor(gateway)
  {
    super(gateway);

    this.table = {
      "name": "ScheduledReminder",
      "alias": "sr"
    };
  }

  /**
   * Method fetches all records matching passed request's criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of DB result
   */
  fetchAll(request)
  {
    var entities = [new ScheduledReminderEntity()];
    return this.query(request, entities);
  }

  /**
   * Method inserts new entity to table
   *
   * @param ScheduledReminderEntity scheduledReminderEntity ScheduledReminder entity
   * @return Promise scheduledReminderEntity Promise of newly created scheduledReminder entity
   */
  create(scheduledReminderEntity)
  {
    logger.info("RethinkDbScheduledReminderGateway::insert - scheduledReminder received", {
      scheduledReminderEntity: scheduledReminderEntity
    });

    if (!(scheduledReminderEntity instanceof ScheduledReminderEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of ScheduledReminder expected",
        {
          scheduledReminderEntity: scheduledReminderEntity
        },
        500
      );
    }

    return this.validateName(scheduledReminderEntity)
      .then(super.insert.bind(this))
      .then(function (scheduledReminderData) {
        return new ScheduledReminderEntity(scheduledReminderData);
      });
  }

  /**
   * Method updates entity in table
   *
   * @param ScheduledReminderEntity scheduledReminderEntity ScheduledReminder entity
   * @return Promise scheduledReminderEntity Promise of newly created scheduledReminder entity
   */
  update(scheduledReminderEntity)
  {
    if (!(scheduledReminderEntity instanceof ScheduledReminderEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of ScheduledReminder expected",
        {
          scheduledReminderEntity: scheduledReminderEntity
        },
        500
      );
    }

    return super.update(scheduledReminderEntity)
      .then(function (scheduledReminderData) {
        return new ScheduledReminderEntity(scheduledReminderData);
      });
  }

  /**
   * Method replaces entity in table
   *
   * @param ScheduledReminderEntity scheduledReminderEntity ScheduledReminder entity
   * @return Promise scheduledReminderEntity Promise of newly created scheduledReminder entity
   */
  replace(scheduledReminderEntity)
  {
    if (!(scheduledReminderEntity instanceof ScheduledReminderEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of ScheduledReminder expected",
        {
          scheduledReminderEntity: scheduledReminderEntity
        }
      );
    }

    return super.replace(scheduledReminderEntity)
      .then(function (scheduledReminderData) {
        return new ScheduledReminderEntity(scheduledReminderData);
      });
  }

  /**
   * Helper method validates scheduledReminder name to be inserted
   *
   * @param ScheduledReminder scheduledReminderEntity ScheduledReminder entity
   * @return Promise device Promise of exception if scheduledReminder name exists
   * otherwise promise of passed object
   */
  validateName(scheduledReminderEntity)
  {
    return this.dataProvider.table(this.table.name)
      .get(scheduledReminderEntity.get("group") + ":" + scheduledReminderEntity.get("type") + ":" + scheduledReminderEntity.get("value"))
      .then(function(scheduledReminderData) {
        if (scheduledReminderData) {
          throw new GatewayError(
            "ScheduledReminder name already in use",
            {
              scheduledReminder: scheduledReminderData
            },
            409
          );
        }

        return scheduledReminderEntity;
      });
  }
}

module.exports = RethinkDbScheduledReminderGateway;
