"use strict";

const common = require("opserve-common");
const AmqpExchangeGateway = common.gateway.AmqpExchangeGateway;
const mongoEscape = common.utilities.mongoEscape;
const logger = common.logger;
const mongoose = require('mongoose');
const Alert = mongoose.model('Alert');
const dateConversions = common.utilities.dateConversions;

class AlertModule {

  constructor() {
    this.amqp = new AmqpExchangeGateway({ name: "AlertFeed", type: "fanout", routingKey: "" });
  }

  find(req, res) {
    //Check if req.body has a state propery with NE, replace the data with $ne 
    if (req.query.query.conditions) {
      if (req.query.query.conditions.status == "1") {
        req.body = {
          state: {
            $ne: 'O'
          }
        };
      }
    }
    Alert.find(req.body).lean().exec((err, alerts) => {
      let alertsResult = {
        alerts: []
      };
      //Error
      if (err) {
        logger.warn("Error while finding alerts::[alertModule.find]", +err);
        res.status(500).send({
          error: err
        });
      }
      //Success
      alertsResult.alerts = alerts;

      return res.send(mongoEscape.unescapeInvalidMongoCharacters(alertsResult));
    });
  }

  findById(req, res) {
    logger.warn("UNIMPLEMENTED: alertModule.findById()");
  }

  create(req, res) {
    logger.silly("Saving alert...::[alertModule.create]");
    let alert = new Alert();
    //created and updated dates
    if (!req.body.createdAt) {
      req.body.createdAt = Date.now();
    }
    if (!req.body.updatedAt) {
      req.body.updatedAt = Date.now();
    }
    //Convert firstoccurence and lastoccurence to date type
    if (req.body.firstOccurrence && req.body.firstOccurrence != "NaN") {
        req.body.firstOccurrence = dateConversions.convertNumberToDate(req.body.firstOccurrence);
    }else if(req.body.firstOccurrence == "NaN"){
        req.body.firstOccurrence = dateConversions.convertNumberToDate(Date.now());
    }
    if (req.body.lastOccurrence && req.body.lastOccurrence != "NaN") {
        req.body.lastOccurrence = dateConversions.convertNumberToDate(req.body.lastOccurrence);
    }else if(req.body.firstOccurrence && req.body.lastOccurrence == "NaN"){
        req.body.lastOccurrence = dateConversions.convertNumberToDate(Date.now());
    }

    // Replace invalid chars which mongo doesnt allow with valid chars
    // var json = JSON.parse(mongoEscape.escape(JSON.stringify(req.body)));
    let json = mongoEscape.escapeInvalidMongoCharacters(req.body);

    let query = {
      deviceId: json.deviceId,
      ruleName: json.ruleName
    };

    let options = {
      returnOriginal: false,
      upsert: true
    };

    alert.collection.findOneAndUpdate(query, json, options, (err, result) => {
      if (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          logger.info("Alert already exists::[alertModule.create]");
          // Duplicate alert
          return res.status(500).send({ succes: false, message: 'Alert already exist!' });
        }
        logger.info("Error while saving alert::[alertModule.create]", +err);
        res.status(500).send({
          error: err
        });
      } else {
        logger.info("Alerts were successfully stored::[alertModule.create]");
        if (result.value.status == "1" && result.value.state != "O") {
          this.amqp.save({ operation: "create", payload: mongoEscape.unescapeInvalidMongoCharacters(result.value) });
        }
        res.send(mongoEscape.unescapeInvalidMongoCharacters(result.value));
      }
    });
  }

  update(req, res) {
    //updated date
    if (!req.body.updatedAt) {
      req.body.updatedAt = Date.now();
    }

    let json = mongoEscape.escapeInvalidMongoCharacters(req.body);

    let query = {
      "_id": json._id
    };

    let options = {
      new: true,
      upsert: false
    };

    Alert.findOneAndUpdate(query, json, options, (err, result) => {
      if (err) {
        logger.warn("Error while updating alerts::[alertModule.update]", +err);
        res.status(500).send({
          error: err
        });
      } else {
        logger.info("Alerts were successfully updated::[alertModule.update]");
        res.send(mongoEscape.unescapeInvalidMongoCharacters(result._doc));
      }
    });
  }

  delete(req, res) {
    logger.warn("UNIMPLEMENTED: alertModule.delete()");
  }

}

module.exports = new AlertModule();
