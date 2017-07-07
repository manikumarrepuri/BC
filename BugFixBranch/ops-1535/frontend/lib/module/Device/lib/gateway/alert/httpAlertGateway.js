
"use strict";

const common            = require("opserve-common");
const GatewayError      = common.gateway.GatewayError;
const HttpGateway       = common.gateway.HttpGateway;
const logger            = common.logger;
const config            = common.Config.get();
const Request           = common.Request;
const DeviceAlertEntity = require("itheon-module-device-entity").DeviceAlertEntity;
const urlencode         = require("urlencode");

class HttpAlertGateway extends HttpGateway
{
  /**
   * Cutom contractor allows to pass data provider instance
   *
   * @param object httpDataProvider DataProvider's instance(i.e. httpDataProvider)
   */
  constructor(httpDataProvider)
  {
    super(httpDataProvider, config.get("backend-api"));
    this.dataProvider.apiUrlParts = [
      "/devices/",
      null,
      "/alerts"
    ];
  }

  /**
   * Method fetches all records matching passed request criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of data from DB
   */
  fetchAll(deviceId, request)
  {
    logger.info("HttpAlertGateway::fetchAll() method called", {
      deviceId: deviceId,
      request: request.export()
    });

    this.setupUrl(deviceId);
    return this.dataProvider.sendGetRequest(request);
  }

  create(deviceId, alertEntity)
  {
    logger.info("HttpAlertGateway::create() method called", {
      deviceId: deviceId,
      alertEntity: alertEntity
    });

    this.setupUrl(deviceId);
    return super.insert(alertEntity)
      .then(function(alertData) {
        return alertData;
      });
  }

  update(deviceId, alertEntity)
  {
    logger.info("HttpAlertGateway::update() method called", {
      deviceId: deviceId,
      alertEntity: alertEntity
    });

    this.setupUrl(deviceId, alertEntity);
    return super.update(alertEntity)
      .then(function(alertData) {
        return new DeviceAlertEntity(alertData);
      });
  }

  /**
   * Method delete records matching passed request criteria
   *
   * @param  Request request Used to specify the query
   * @return Promise promise Promise of data from DB
   */
   delete(deviceId, id)
   {
     if (!deviceId) {
       throw new GatewayError("Invalid deviceId passed. Delete should be called with a valid deviceId");
     }

     if (!id) {
       throw new GatewayError("Invalid id passed. Delete should be called with a valid id");
     }

     var request = new Request();
     request.setPayload({"id": id});

     this.setupUrl(deviceId, id);
     return this.dataProvider.sendDeleteRequest(request);
  }

  setupUrl(deviceId, id)
  {
    logger.info("HttpAlertGateway::setupUrl() method called", {
      deviceId: deviceId,
      id: id
    });

    this.dataProvider.apiUrlParts[1] = urlencode(deviceId);
    this.dataProvider.apiUrl = this.dataProvider.apiUrlParts.join("");
  }
}

module.exports = HttpAlertGateway;
