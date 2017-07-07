"use strict";

const mongoose = require('mongoose');
const common = require("opserve-common");
const async = require('async');
const lodash = require('lodash');
const Device = mongoose.model('Device');
const logger = common.logger;

class DeviceAlertModule {

  find(deviceId, req, res, callback) {
    logger.warn("UNIMPLEMENTED::[deviceAlertModule.find]");
  }

  findById(req, res, callback) {
    logger.warn("UNIMPLEMENTED::[deviceAlertModule.findById]");
  }

  create(req, res, callback) {
    logger.silly("create method...::[deviceAlertModule.create]");
    //Get the device document for the given deviceId from the req.parms.deviceId
    //update alerts field in the document from the req.body.id : with this format - "alerts": {id:"rulename"}
    var alertsObj = {
      id: req.body.id
    };
    Device.update({
      id: req.params.deviceId
    }, {
        $push: {
          alerts: alertsObj
        }
      },
      function (err, numberAffected, rawResponse) {
        logger.info("Save successful...::[deviceAlertModule.create]");
        res.json({
          ok: true
        });
      });
  }

  update(deviceId, deviceAlertEntity) {
    logger.warn("UNIMPLEMENTED::[deviceAlertModule.update]");
  }

  delete(req, res, callback) {
    logger.silly("Removing the rulename is started...::[deviceAlertModule.delete]");
    //Get the device document for the given deviceId from the req.parms.deviceId
    //Remove the rulename from the alerts array req.parms.ruleName
    Device.update({
      id: req.params.deviceId
    }, {
        $pull: {
          alerts: req.params.ruleName
        }
      },
      function (err, numberAffected, rawResponse) {
        logger.info("Removal successful...::[deviceAlertModule.delete]");
        res.json({
          ok: true
        });
      });
  }

};

module.exports = new DeviceAlertModule();
