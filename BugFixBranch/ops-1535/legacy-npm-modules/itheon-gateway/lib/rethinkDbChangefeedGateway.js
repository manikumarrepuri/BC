"use strict";

var appRootPath       = require("app-root-path");
var inspector         = require('schema-inspector');
var BaseEntity        = require("itheon-entity").BaseEntity;
var BaseGateway       = require("./baseGateway");
var RethinkDbGateway  = require("./rethinkDbGateway");
var Request           = require("itheon-request");
var _                 = require("itheon-utility").underscore;
var logger            = require("itheon-logger");
var GatewayError      = require("./gatewayError");

/**
 * We need to allow for subscribing and unsubscribing to changes
 *
 */
class RethinkDbChangefeedGateway extends RethinkDbGateway
{
  /**
   * Cutom contractor allows to pass data provider instance
   *
   * @param object dataProvider Data provider(i.e. dbConnection)
   */
  constructor(dataProvider)
  {
    super(dataProvider);
    this.openSockets = {};
  }

  subscribeToChanges(socket)
  {
    this.openSockets[socket.id] = true;

    this.dataProvider.table(this.table.name)
    .changes({includeTypes: true}).run().then((feed) => {

      logger.info("Subscribed to changeFeed from: " + this.table.name + ".");

      if(!this.openSockets[socket.id]) {
        logger.info("Unsubscribing: " + socket.id + " from " + this.table.name + " changes.");
        feed.close();
        return;
      }

      feed.each((err, change) => {
        if (err) {
          logger.error(err.toString(), err.stack);
          if (feed) {
            feed.close();
          }
          logger.info('Restarting changefeed for: ' + this.table.name);
          this.subscribeToChanges(socket);
          return;
        }

        logger.info(this.table.name + ' change received.');
        logger.silly('Details:', change);

        socket.emit(_.camelize(this.table.name, true) + 'Update', change);
        logger.info(_.camelize(this.table.name, true) + 'Update' + ' emitted.');
      });
    }).error((err) => {
      logger.error(err);
      logger.info('Restarting changefeed for: ' + this.table.name);
      this.subscribeToChanges(socket);
    });
  }

  unsubscribeToChanges(socket)
  {
    delete this.openSockets[socket.id];
  }
}

module.exports = RethinkDbChangefeedGateway;
