"use strict";

const mongoose = require('mongoose');
const async = require('async');
const lodash = require('lodash');
var AlertsHistory = mongoose.model('AlertsHistory');
const common = require("opserve-common");
const logger = common.logger;
const mongoEscape = common.utilities.mongoEscape;
const dateConversions = common.utilities.dateConversions;

class AlertHistoryModule {

    find(req, res, callback) {
        //Check if the request has any query conditions.
        if (req.query) {
            if (req.query.query) {
                let json = mongoEscape.escapeInvalidMongoCharacters(req.query.query.conditions);
                AlertsHistory.find(json).lean().sort({ createdAt: -1 }).exec(function (err, alertHistoryData) {
                    var alertHistoryResult = { alertHistory: [] };
                    //Error
                    if (err) {
                        return res.status(500).send({ error: err });
                    }
                    //Success
                    alertHistoryResult.alertHistory = alertHistoryData;
                    res.send(mongoEscape.unescapeInvalidMongoCharacters(alertHistoryResult));
                });
            }
            else {
                AlertsHistory.find().sort({ createdAt: -1 }).lean().exec(function (err, alertHistoryData) {
                    var alertHistoryResult = { alertHistory: [] };
                    //Error
                    if (err) {
                        return res.status(500).send({ error: err });
                    }
                    //Success
                    alertHistoryResult.alertHistory = alertHistoryData;
                    res.send(mongoEscape.unescapeInvalidMongoCharacters(alertHistoryResult));
                });
            }
        }

    }

    findById(req, res, callback) {
        logger.warn("UNIMPLEMENTED::[alertHistoryModule.findById]");
    }

    create(req, res, callback) {
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
        logger.silly("Saving alert history...::[alertHistoryModule.create]");
        let json = mongoEscape.escapeInvalidMongoCharacters(req.body);
        var newAlertsHistory = new AlertsHistory();
        newAlertsHistory.deviceId = json.deviceId;
        newAlertsHistory.firstOccurrence = json.firstOccurrence;
        newAlertsHistory.lastOccurrence = json.lastOccurrence;
        newAlertsHistory.matchedConditions = json.matchedConditions;
        newAlertsHistory.entity = json.entity;
        newAlertsHistory.group = json.group;
        newAlertsHistory.name = json.name;
        newAlertsHistory.icon = json.icon;
        newAlertsHistory.brief = json.brief;
        newAlertsHistory.fullText = json.fullText;
        newAlertsHistory.ruleName = json.ruleName;
        newAlertsHistory.tags = json.tags;
        newAlertsHistory.status = json.status;
        newAlertsHistory.state = json.state;
        newAlertsHistory.severity = json.severity;
        newAlertsHistory.resourceUrl = json.resourceUrl
        newAlertsHistory.subscribers = json.subscribers
        newAlertsHistory.timeToClose = json.timeToClose
        newAlertsHistory.acknowledged = json.acknowledged
        newAlertsHistory.assignee = json.assignee;
        newAlertsHistory.createdAt = Date.now();
        newAlertsHistory.updatedAt = Date.now();
        // save the user
        newAlertsHistory.save(function (err) {
            if (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    logger.info("Alert History already exists::[alertHistoryModule.create]");
                    // Duplicate alert history
                    return res.status(500).send({ succes: false, message: 'Alert History already exist!' });
                }
                else{
                    logger.info("Error while saving alert history::[alertHistoryModule.create]", +err);
                    return res.status(500).send({
                        error: err
                    });
                }
            }

            AlertsHistory.findOne({ deviceId: req.body.deviceId, assignee: req.body.assignee, createdAt: newAlertsHistory.createdAt }).lean().exec(function (err, resultedRecord) {
                var alertsHistoryResult = { alertsHistory: [] };
                //Error
                if (err) {
                    return res.status(500).send({ error: err });
                }
                alertsHistoryResult.alertsHistory = mongoEscape.unescapeInvalidMongoCharacters(resultedRecord);
                res.send(alertsHistoryResult);
            });

        });
    }

    update(req, res, callback) {
        logger.warn("UNIMPLEMENTED::[alertHistoryModule.create]");
    }

    delete(req, res, callback) {
        logger.warn("UNIMPLEMENTED::[alertHistoryModule.create]");
    }

};

module.exports = new AlertHistoryModule();
