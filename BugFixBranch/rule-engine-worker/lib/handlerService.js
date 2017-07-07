"use strict";

var appRootPath = require("app-root-path");
var common      = require('opserve-common');
var _           = common.utilities.underscore;
var Handlebars = common.utilities.handlebars;
var AmqpGateway = common.gateway.AmqpQueueGateway;
const logger    = common.logger;
const HandlerServiceError = common.error.HandlerServiceError;

var moment      = require("moment");
var EventService = require("./eventService");
var RuleEngineService = require("itheon-rule-engine").RuleEngineService;
var DeviceService = require("./deviceService");


class HandlerService {
  /**
   * Custom constructor allows to inject device and rule that will be used
   * in validation
   *
   * @param Device device Device data
   * @param Rule   rule   Rule data
   */
  constructor(eventService, deviceService, ruleEngineService) {
    if (eventService && !(eventService instanceof EventService)) {
      throw new HandlerServiceError(
        "Invalid event service passed. Instance of EventService expected"
      );
    }

    if (deviceService && !(deviceService instanceof DeviceService)) {
      throw new HandlerServiceError(
        "Invalid device service passed. Instance of DeviceService expected"
      );
    }

    if (ruleEngineService && !(ruleEngineService instanceof RuleEngineService)) {
      throw new HandlerServiceError(
        "Invalid rule engine service passed. Instance of RuleEngineService expected"
      );
    }

    if (!eventService) {
      eventService = new EventService();
    }

    if (!deviceService) {
      deviceService = new DeviceService();
    }

    if (!ruleEngineService) {
      ruleEngineService = new RuleEngineService();
    }

    if (!this.amqp) {
      this.amqp = new AmqpGateway({ sendTo: "events" });
    }

    this.eventService = eventService;
    this.deviceService = deviceService;
    this.ruleEngineService = ruleEngineService;
    this.globalDevice = null;
    this.parseableVaraibles = null;
  }

  /**
   * Main method to be called to handle incoming performance data
   *
   * @return Promise result Promise of statup result
   */
  handlePerformanceData(performanceData) {
    logger.info(
      "HandlerService: Handling incoming performance data"
    );

    if (!performanceData.metrics) {
      logger.info(
        "Performance Data does not contain any metrics."
      );

      //Skip Event
      return new Promise((resolve, reject) => {
        resolve();
      });
    }

    return this.getDeviceIfKnown(performanceData)
      .then((device) => {
        if (!device) {
          logger.info(
            "HandlerService: Device not found. Creating new device " +
            "based on passed performance data"
          );
          device = this.createDeviceFromPerformanceData(performanceData);
          device.alerts = {};
          device.updatedAt = new Date();
          return this.saveDeviceInDb(device)
            .catch((error) => {
              logger.warn("Possible error saving device in database", error);
              // ignore as race condition generated go on with your life
              return device;
            });
        }
        logger.info(
          "HandlerService: Merging incoming metrics into device"
        );
        device = this.deviceService.mergeMetrics(device, performanceData);
        device.updatedAt = new Date();
        return device;
      })
      .then((device) => {
        return this.saveDeviceInCache(device);
      })
      .then((device) => {
        return this.resolveDeviceRules(device);
      })
      .then((device) => {
        return this.evaluateRules(device, performanceData);
      })
      .catch(function (error) {
        logger.error(
          "HandlerService: Error occurred", {
            error: error
          }
        );
      });
  }

  /**
   * Method generates hashes for each of passed devices
   *
   * @param object|array devices List of devices
   * @return object|array devices List of devices (with hashes)
   */
  generateDeviceHash(device) {
    logger.info(
      "HandlerService: Generating device hash for device " +
      "using DeviceService"
    );

    var devices = this.deviceService.generateDeviceHashes([device]);

    if (!_.isArray(devices) || _.isEmpty(devices)) {
      throw new HandlerServiceError(
        "HandlerService: Invalid list of devices sent to method. " +
        "Array expected"
      );
    }

    return devices.pop();
  }

  /**
   * Method checks is new performance record about unknown device. It
   * checks memory, cache and db in that order.
   *
   * @param object performanceRecord Performance record containing device name,
   * group and metrics
   * @return Promise result Promise of result of finding device
   */
  getDeviceIfKnown(performanceData) {
    logger.info(
      "HandlerService: Checking is known device"
    );
    logger.silly(
      "HandlerService: Checking is known device - performance data", {
        performanceData: performanceData
      }
    );

    var query = {
      name: performanceData.name,
      group: performanceData.group
    };

    logger.info(
      "HandlerService: Getting device from cache"
    );

    return this.deviceService.use("cache").getDevices(query)
      .then(function (devices) {

        if (_.isArray(devices)) {
          devices = devices.pop();
        }

        let device = (_.isObject(devices)) ? devices[Object.keys(devices)[0]] : undefined;

        if (typeof device != "undefined") {
          logger.info(
            "HandlerService: Device recognised"
          );

          return device;
        }

        logger.info(
          "HandlerService: Device not recognised"
        );

        return null;
      });
  }

  getGlobalDevice() {
    var query = {
      name: "Generic",
      group: "Bluechip"
    };

    return this.deviceService.use("cache").getDevices(query)
      .then(function (results) {

        if (_.isArray(results)) {
          results = results.pop();
        }

        var globalDevice = results[Object.keys(results)[0]];

        return globalDevice;
      });
  }

  /**
   * Method creates device object from performance data object
   *
   * @param PerformanceData performanceData Performance data
   * @return Device device Device data
   */
  createDeviceFromPerformanceData(performanceData) {
    logger.info(
      "HandlerService: Creating new device data from performance data"
    );

    var device = {
      id: performanceData.group + ":" + performanceData.name,
      name: performanceData.name,
      group: performanceData.group,
      platform: performanceData.platform,
      metrics: performanceData.metrics,
      tags: performanceData.tags || [],
      displayName: null
    };

    return device;
  }

  /**
   * Method creates stores device object in db
   *
   * @param Device object Device
   * @return Device object Device
   */
  saveDeviceInDb(device) {
    logger.info(
      "HandlerService: Saving device to database"
    );

    return this.deviceService.use("db").save(device)
      .then(function (data) {
        return device;
      });
  }

  /**
   * Method creates stores device object in cache
   *
   * @param Device object Device
   * @return Device device Device
   */
  saveDeviceInCache(device) {
    return this.deviceService.use("cache").save(device)
      .then(function () {
        return device;
      });
  }

  /**
   * Method creates stores device object in memory
   *
   * @param Device object Device
   * @return Device object Device
   */
  saveDeviceInMemory(device) {
    return this.deviceService.use("memory").save(device)
      .then(function () {
        return device;
      });
  }

  /**
   * Method merges device rules with global rules and returns device
   *
   * @param Device Device object
   */
  resolveDeviceRules(device) {
    logger.info(
      "HandlerService: Resolving rules that applies to device by merging " +
      "custom rules with global rules"
    );

    var that = this;

    return this.getGlobalDevice()
      .then(function (globalDevice) {
        if (!_.isObject(globalDevice)) {
          throw new HandlerServiceError(
            "Unable to fetch global device with rules"
          );
        }

        globalDevice.cachedAt = new Date();
        that.globalDevice = globalDevice;

        //This is where we are extending rules!
        device.mergedRules = _.extend(globalDevice.rules, device.rules);

        return device;
      });
  }

  evaluateRules(device, performanceData) {
    logger.verbose(
      "HandlerService: Evaluating rules against passed device " +
      "and performance data"
    );

    var found;
    var that = this;

    var metrics = performanceData.metrics;
    this.originalEvent = performanceData.originalEvent;

    _(device.mergedRules).forEach(function (rule, ruleName) {

      // If the rule isn"t enabled then stop here
      if (!rule.enabled) {
        logger.verbose(
          "Skipping Disabled Rule - " + rule.name + " for " +
          performanceData.group + " " + performanceData.name
        );

        //Skip rule
        return false;
      }

      //Check that the Performance Metric is required by the rule
      let handleWhen = rule.handleWhen;
      found = true;

      for (var i=0; i < handleWhen.dependencies.length; i++) {
        let dependency =  handleWhen.dependencies[i];

        //Handle templates in dependency's we currently only have one otherwise we'd use handleBars
        if(dependency.indexOf('{{') !== -1) {
          dependency = dependency.replace('{{metricGroup}}', performanceData.metricGroup);
        }

        if(dependency.indexOf('.') === -1) {
          //If we can't find a metric that we need then we can't process the rule
          if (!metrics[dependency] && typeof metrics[dependency] == "undefined") {
            found = false;
            break;
          }

          continue;
        }

        let metricNameParts = dependency.split(".");

        //If we don't have the parent object stop there
        if (!metrics[metricNameParts[0]]) {
          found = false;
          break;
        }

        //Try and workout where we should look next
        if (metricNameParts[1] == '*') {
          metricNameParts[1] = Object.keys(metrics[metricNameParts[0]])[0];
        }

        //If we don't have the entity level stop here
        if (!metrics[metricNameParts[0]][metricNameParts[1]]) {
          found = false;
          break;
        }

        //Now look for the metric
        found = Boolean(_.findKey(metrics[metricNameParts[0]][metricNameParts[1]], function (entryMetric, key) {
          return key == metricNameParts[2];
        }));

        if (!found) {
          break;
        }

        rule.entity = metricNameParts[1];
      }

      // If the performance record doesn"t contain a metric we need then, there is no point going any further
      if (!found) {
        logger.verbose(
          "Skipping Rule - Performance Data does not contain any metrics required by rule " + rule.name
        );

        //Skip rule
        return false;
      }

      //Check tags
      if (handleWhen.tags) {
        var intersection = _.intersection(handleWhen.tags, device.tags);
        if (intersection.length < handleWhen.tags.length) {
          logger.verbose(
            "Skipping Rule - Device does not contain any tags for this rule: " + rule.name
          );

          //Skip rule
          return false;
        }
      }

      //Handle templates in the rule definition we currently only have one otherwise we'd use handleBars
      let definitions = {};
      _(rule.definition).forEach(function(definition, key) {
        if(key.indexOf('{{') !== -1) {
          definitions[key.replace('{{metricGroup}}', performanceData.metricGroup)] = definition;
        }
      });

      if(Object.keys(definitions).length >= 1) {
        rule.definition = definitions
      }

      var result = false;
      try {
        result = that.ruleEngineService.validate(device, rule);
      } catch (exception) {
        logger.error(
          "Error occurred"
        );
        logger.error(
          exception.message,
          exception
        );

        return false;
      }

      if (result.code === "failure") {
        if (that.wasEventRaised(device, rule)) {
          that.sendCloseEvent(device, rule, result);
          return false;
        }

        logger.verbose(
          "HandlerService: Nothing to do, " +
          "performance data ignored for rule " + rule.name
        );

        return false;
      }

      if (that.wasEventRaised(device, rule)) {
        that.sendUpdateEvent(device, rule, result);
        return false;
      }

      that.sendNewEvent(device, rule, result);
    });
  }

  /**
   * Method checks is event currently assigned for specified rule.
   *
   */
  wasEventRaised(device, rule) {
    logger.info(
      "HandlerService: Checking was event raised before" +
      "(is it attached to device)"
    );

    let deviceEvents = device.events;
    let ruleName = rule.name;

    //If this is an entity level statistic add the entity to the rule name
    if(!_.isEmpty(rule.entity)) {
      ruleName += " - " + rule.entity
    }

    if (_.has(deviceEvents, ruleName)) {
      return true;
    }

    return false;
  }

  /**
   * Method sends close event for device and rule
   */
  sendCloseEvent(device, rule, result) {
    logger.info(
      "HandlerService: Sending close event for device " +
      device.group + ":" + device.name +
      " for rule " + rule.name
    );

    result.state = "C";
    let event = this.createEvent(device, rule, result);
    let deviceEvents = device.events;

    let ruleName = event.ruleName;

    //If this is an entity level statistic add the entity to the rule name
    if(!_.isEmpty(rule.entity)) {
      ruleName += " - " + rule.entity
    }

    event.occurrences = deviceEvents[ruleName].occurrences;
    event.firstOccurrence = deviceEvents[ruleName].firstOccurrence;
    event.lastOccurrence = deviceEvents[ruleName].lastOccurrence;

    delete deviceEvents[ruleName];
    device.events = deviceEvents;

    return this.saveEventInQueue(event)
      .then(() => {
        return this.deviceService.use("cache").save(device);
      });
  }

  sendUpdateEvent(device, rule, result) {
    logger.info(
      "HandlerService: Sending update event for device " +
      device.group + ":" + device.name +
      " for rule " + rule.name
    );

    result.state = "U";
    let event = this.createEvent(device, rule, result);
    let deviceEvents = device.events;

    let ruleName = event.ruleName;

    //If this is an entity level statistic add the entity to the rule name
    if(!_.isEmpty(rule.entity)) {
      ruleName += " - " + rule.entity
    }

    event.occurrences = deviceEvents[ruleName].occurrences + 1;
    event.firstOccurrence = deviceEvents[ruleName].firstOccurrence;

    deviceEvents[ruleName] = event;
    device.events = deviceEvents;

    return this.saveEventInQueue(event)
      .then(() => {
        return this.deviceService.use("cache").save(device);
      });
  }

  sendNewEvent(device, rule, result) {
    logger.info(
      "HandlerService: Sending new event for device " +
      device.group + ":" + device.name +
      " for rule " + rule.name
    );

    result.state = "N";
    let event = this.createEvent(device, rule, result);
    let deviceEvents = (device.events) ? device.events : {};
    let ruleName = event.ruleName;

    //If this is an entity level statistic add the entity to the rule name
    if(!_.isEmpty(rule.entity)) {
      ruleName += " - " + rule.entity
    }

    deviceEvents[ruleName] = event;
    device.events = deviceEvents;

    return this.saveEventInQueue(event)
      .then(() => {
        return this.deviceService.use("cache").save(device);
      });
  }

  createEvent(device, rule, result) {
    logger.info(
      "HandlerService: Creating event for device " +
      device.id + " rule " + rule.name
    );

    let severity = result.severity ? result.severity : 5;
    let severityName = severity === 5 ? "default" : "severity" + severity;

    // var thresholds = rule.thresholds[severityName]; - not used?

    let eventDetails = rule.eventDetails[severityName];
    if (!eventDetails) {
      eventDetails = rule.eventDetails["default"];
    }

    let subscribers = rule.subscribers;

    let briefText = eventDetails.briefText;
    let fullText = eventDetails.fullText;

    let details;
    if (!rule.entity) {
      details = _.object(_.map(device.metrics, function (obj, key) {
        return [key, obj.value];
      }));
    } else {
      details = _.object(_.map(device.metrics[Object.keys(device.metrics)[0]][rule.entity], function (obj, key) {
        return [key, obj.value];
      }));
    }

    //Add the original event
    details.originalEvent = this.originalEvent;

    briefText = this.inflateErrorMessage(briefText, details);
    fullText = this.inflateErrorMessage(fullText, details);

    //If we have no rule tags add some.
    if (!rule.tags) {
      rule.tags = [];
    }

    return {
      name: device.name,
      group: device.group,
      platform: device.platform,
      ruleName: rule.name,
      entity: rule.entity || "",
      severity: severity,
      state: result.state,
      tags: (device.tags?_.uniq(device.tags.concat(rule.tags)):rule.tags),
      occurrences: 1,
      brief: briefText,
      fullText: fullText,
      subscribers: subscribers,
      firstOccurrence: moment().format("x"),
      lastOccurrence: moment().format("x"),
      matchedConditions: result.matchedConditions
    };
  }

  inflateErrorMessage(text, details) {
    try {
      var template = Handlebars.compile(text);
      return template(details);
    } catch (e) {
      logger.error("HANDLEBARS COMPILE ERROR on text: \n" + text + "DETAILS: \n" + details, e);
    }
  }

  /**
   * Method creates stores event object in queue
   *
   * @param Alert Object Event entity
   * @return Alert Object Event entity
   */
  saveEventInQueue(event) {
    logger.info(
      "HandlerService: Saving event to queue"
    );

    return this.amqp.save(event);
  }
}

module.exports = HandlerService;
