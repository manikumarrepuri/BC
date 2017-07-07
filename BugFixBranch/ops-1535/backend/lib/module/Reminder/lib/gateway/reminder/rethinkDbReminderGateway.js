
"use strict";

var appRootPath      = require("app-root-path");
const common            = require("opserve-common");
const RethinkDbGateway  = common.gateway.RethinkDbGateway;
const _                 = common.utilities.underscore;
const GatewayError      = common.gateway.GatewayError;
const logger            = common.logger;
var ReminderEntity   = require("itheon-module-reminder-entity").ReminderEntity;
var DeviceEntity     = require("itheon-module-device-entity").DeviceEntity;


class RethinkDbReminderGateway extends RethinkDbGateway
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
      "name": "Reminder",
      "alias": "re"
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
    var entities = [new ReminderEntity()];
    return this.query(request, entities);
  }

  /**
   * Method inserts new entity to table
   *
   * @param ReminderEntity reminderEntity Reminder entity
   * @return Promise reminderEntity Promise of newly created reminder entity
   */
  create(reminderEntity)
  {
    logger.info("RethinkDbReminderGateway::insert - reminder received", {
      reminderEntity: reminderEntity
    });

    if (!(reminderEntity instanceof ReminderEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of Reminder expected",
        {
          reminderEntity: reminderEntity
        },
        500
      );
    }

    return this.validateName(reminderEntity)
      .then(super.insert.bind(this))
      .then(function (reminderData) {
        return new ReminderEntity(reminderData);
      });
  }

  /**
   * Method updates entity in table
   *
   * @param ReminderEntity reminderEntity Reminder entity
   * @return Promise reminderEntity Promise of newly created reminder entity
   */
  update(reminderEntity)
  {
    if (!(reminderEntity instanceof ReminderEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of Reminder expected",
        {
          reminderEntity: reminderEntity
        },
        500
      );
    }

    return super.update(reminderEntity)
      .then(function (reminderData) {
        return new ReminderEntity(reminderData);
      });
  }

  /**
   * Method replaces entity in table
   *
   * @param ReminderEntity reminderEntity Reminder entity
   * @return Promise reminderEntity Promise of newly created reminder entity
   */
  replace(reminderEntity)
  {
    if (!(reminderEntity instanceof ReminderEntity)) {
      throw new GatewayError(
        "Invalid entity passed. Instance of Reminder expected",
        {
          reminderEntity: reminderEntity
        }
      );
    }

    return super.replace(reminderEntity)
      .then(function (reminderData) {
        return new ReminderEntity(reminderData);
      });
  }

  /**
   * Helper method validates reminder name to be inserted
   *
   * @param Reminder reminderEntity Reminder entity
   * @return Promise device Promise of exception if reminder name exists
   * otherwise promise of passed object
   */
  validateName(reminderEntity)
  {
    return this.dataProvider.table(this.table.name)
      .get(reminderEntity.get("group") + ":" + reminderEntity.get("type") + ":" + reminderEntity.get("value"))
      .then(function(reminderData) {
        if (reminderData) {
          throw new GatewayError(
            "Reminder name already in use",
            {
              reminder: reminderData
            },
            409
          );
        }

        return reminderEntity;
      });
  }
}

module.exports = RethinkDbReminderGateway;
