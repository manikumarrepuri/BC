"use strict";

const common = require("opserve-common");
const mongoose = require('mongoose');
const async = require('async');
const lodash = require('lodash');
const _ = common.utilities.underscore;
const Device = mongoose.model('Device');
const Rule = mongoose.model('Rule');
const Tag = mongoose.model('Tag');
const logger = common.logger;
const mongoEscape = common.utilities.mongoEscape;

class DeviceModule {
    find(req, res, callback) {
        //Process based on condition passed
        // 1 : fetch all the devices data for the devices UI
        // 2 : fetch only one document based on device group and name
        switch (req.query.query.conditions.whatToFetch) {
            case "1":
                //Create an object to hold the results.
                var devicesResult = { devices: [], rules: [], globalDevices: [], tags: [] };
                var tasks = [
                    //lean would convert the mongodb object to the regular object. like removing _doc and unnecessary elements.
                    // Load Devices
                    function (callback) {
                        Device.find({ id: { $ne: "Bluechip:Generic" } }).lean().exec(function (err, devices) {
                            if (err) return callback(err);
                            devicesResult.devices = devices;
                            callback();
                        });
                    },
                    // Load Rules
                    function (callback) {
                        Rule.find().lean().exec(function (err, rules) {
                            if (err) return callback(err);
                            devicesResult.rules = rules;
                            callback();
                        });
                    },
                    //load global devices data
                    function (callback) {
                        Rule.find({ deviceId: "Bluechip:Generic" }).lean().exec(function (err, globaldevices) {
                            if (err) return callback(err);
                            devicesResult.globalDevices = globaldevices;
                            callback();
                        });
                    },
                    //load tags data
                    function (callback) {
                        Tag.find().lean().exec(function (err, tags) {
                            if (err) return callback(err);
                            devicesResult.tags = tags;
                            callback();
                        });
                    }
                ];
                //This gets executed once all the data is loaded.
                async.parallel(tasks, function (err) {
                    if (err) return next(err);
                    lodash.forEach(devicesResult.devices, function (value, index, theArray) {
                        //Rules
                        var ruleObject = lodash.find(devicesResult.rules, { 'deviceId': value.id });
                        if (ruleObject) {
                            theArray[index].rules = ruleObject;
                        }
                        //Tags --TODO
                        var tags = [];
                        var customerObject = lodash.find(devicesResult.tags, { 'id': "system:customer:" + value.group });
                        var hostObject = lodash.find(devicesResult.tags, { 'id': "system:host:" + value.name });
                        var platformObject = lodash.find(devicesResult.tags, { 'value': value.platform });
                        if (customerObject)
                            tags.push(customerObject.id);
                        if (hostObject)
                            tags.push(hostObject.id);
                        if (platformObject)
                            tags.push(platformObject.id);
                        if (tags.length > 0) {
                            theArray[index].tags = tags;
                        }
                        //Replace with 0 if any of the below three values are undefined.
                        //TODO This has to be handled in Mongo collection as '0' as default value
                        if (!value.cpuBusy) { value.cpuBusy = 0; }
                        if (!value.physicalMemoryUsed) { value.physicalMemoryUsed = 0; }
                        if (!value.storage) { value.storage = 0; }
                        //OPS-1376 Replace displayname with name
                        if (!value.displayName) {
                            theArray[index].displayName = value.name;
                        }

                        //Put the data formatting bit here instead of Frontend API

                        theArray[index].alertsCount = _.size(value.alerts);
                        var metrics = {};
                        if (value.hasOwnProperty('metrics')) {
                            if (value.metrics.hasOwnProperty('cpuBusy')) {
                                metrics.cpuBusy = value.metrics.cpuBusy;
                                theArray[index].cpuBusy = value.metrics.cpuBusy.value;
                            }

                            if (value.metrics.hasOwnProperty('pctSystemAspUsed')) {
                                metrics.pctSystemAspUsed = value.metrics.pctSystemAspUsed;
                                metrics.pctSystemAspUsed.value = parseFloat(value.metrics.pctSystemAspUsed.value).toFixed(2);
                                theArray[index].pctSystemAspUsed = value.metrics.pctSystemAspUsed.value;
                            }

                            if (value.metrics.hasOwnProperty('physicalMemoryUsed')) {
                                metrics.physicalMemoryUsed = value.metrics.physicalMemoryUsed;
                                theArray[index].physicalMemoryUsed = value.metrics.physicalMemoryUsed.value;
                            }
                        }
                        theArray[index].metrics = metrics;
                        // Fix device group
                        if (value.group && value.group.indexOf(':') !== -1) {
                            let groupArr = value.group.split(':');
                            //If the last element of the array is the computer name delete it
                            if (groupArr[groupArr.length - 1] == value.name) {
                                delete groupArr[groupArr.length - 1];
                            }
                            theArray[index].group = groupArr.join(' ');
                        }

                        //Set date object's for device
                        // theArray[index].createdAt = new Date(value.createdAt);
                        //  theArray[index].updatedAt = new Date(value.updatedAt);

                    });
                    //We are done fetching the required data from rules, just delete it from the Array.
                    delete devicesResult["rules"];
                    delete devicesResult["tags"];
                    //Send the response with data
                    res.send(mongoEscape.unescapeInvalidMongoCharacters(devicesResult));
                });
                break;
            case "2":
                //Create an object to hold the results.
                var devicesResult = { devices: [], rules: [] };
                var tasks = [
                    //lean would convert the mongodb object to the regular object. like removing _doc and unnecessary elements.
                    // Load Devices
                    function (callback) {
                        Device.findOne({ group: req.query.query.conditions.group, name: req.query.query.conditions.name }).lean().exec(function (err, devices) {
                            if (err) return callback(err);
                            devicesResult.devices = devices;
                            callback();
                        });
                    },
                    // Load Rules
                    function (callback) {
                        Rule.find().lean().exec(function (err, rules) {
                            if (err) return callback(err);
                            devicesResult.rules = rules;
                            callback();
                        });
                    }
                ];
                //This gets executed once all the data is loaded.
                async.parallel(tasks, function (err) {
                    if (err) return next(err);
                    if (devicesResult.devices) {
                        var ruleObject = lodash.find(devicesResult.rules, { 'deviceId': devicesResult.devices.id });
                        if (ruleObject) {
                            theArray[index].rules = ruleObject;
                        }
                    }
                    //We are done fetching the required data from rules, just delete it from the Array.
                    delete devicesResult["rules"];
                    //Send the response with data
                    res.send(mongoEscape.unescapeInvalidMongoCharacters(devicesResult));
                });
                break;
            default:
                //Get the device data for the given deviceid : id
                Device.findOne({ id: req.query.query.conditions.id }).lean().exec(function (err, device) {
                    if (err) return callback(err);
                    if (device) {
                        res.send(mongoEscape.unescapeInvalidMongoCharacters(device));
                    } else {
                        return res.json(device);
                    }
                });
                break;
        }
    }

    findById(req, res, callback) {
        logger.warn("UNIMPLEMENTED::[deviceModule.findById]");
    }

    create(req, res, callback) {
        logger.silly("Saving device...::[deviceModule.create]");
        //created and updated dates
        if (!req.body.createdAt) {
            req.body.createdAt = Date.now();
        }
        if (!req.body.updatedAt) {
            req.body.updatedAt = Date.now();
        }
        var device = new Device();
        let json = mongoEscape.escapeInvalidMongoCharacters(req.body);
        device.collection.findOneAndUpdate({
            id: json.id
        }, // query
            json, // replacement
            {
                returnOriginal: false,
                upsert: true
            }, // options
            function (err, device) {
                if (err) {
                    if (err.name === 'MongoError' && err.code === 11000) {
                        logger.info("Device already exists::[deviceModule.create]");
                        // Duplicate device
                        return res.status(500).send({ succes: false, message: 'Device already exist!' });
                    }
                    logger.info("Error while saving devices::[deviceModule.create]", +err);
                    res.status(500).send({
                        error: err
                    });
                } else {
                    logger.info('Devices were successfully stored::[deviceModule.create]');
                    res.send(mongoEscape.unescapeInvalidMongoCharacters(device.value));
                }
            });
    }

    update(req, res, callback) {
        logger.silly('Updating device...::[deviceModule.update]');
        //updated date
        if (!req.body.updatedAt) {
            req.body.updatedAt = Date.now();
        }
        var device = new Device();
        let json = mongoEscape.escapeInvalidMongoCharacters(req.body);
        device.collection.findOneAndUpdate({
            id: json.id
        }, // query
            json, // replacement
            {
                returnOriginal: false,
                upsert: false
            }, // options
            function (err, device) {
                if (err) {
                    logger.warn("Error while updating devices::[deviceModule.create]", +err);
                    res.status(500).send({
                        error: err
                    });
                } else {
                    logger.info('Devices were successfully updated::[deviceModule.update]');
                    res.send(mongoEscape.unescapeInvalidMongoCharacters(device.value));
                }
            });
    }
};

module.exports = new DeviceModule();
