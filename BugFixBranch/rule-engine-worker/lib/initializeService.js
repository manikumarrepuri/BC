"use strict";

var appRootPath = require("app-root-path");
var common      = require('opserve-common');
var _           = common.utilities.underscore;
const logger    = common.logger;
const InitializeServiceError = common.error.InitializeServiceError;

var ClusterService = require("./clusterService");
var DeviceService  = require("./deviceService");

class InitializeService
{
  /**
   * Custom constructor allows to inject cluster and device services
   * that will be used to store and retrieve data
   *
   * @param ClusterService clusterService Cluster service
   * @param DeviceService deviceService  Device service
   */
  constructor(clusterService, deviceService)
  {
    if (clusterService && !(clusterService instanceof ClusterService)) {
      throw new InitializeServiceError(
        "Invalid cluster service passed. Instance of ClusterService expected"
      );
    }

    if (deviceService && !(deviceService instanceof DeviceService)) {
      throw new InitializeServiceError(
        "Invalid device service passed. Instance of DeviceService expected"
      );
    }

    if (!clusterService) {
      clusterService = new ClusterService();
    }

    if (!deviceService) {
      deviceService = new DeviceService();
    }

    this.clusterService = clusterService;
    this.deviceService  = deviceService;
  }

  /**
   * Main method to be called to start RE instance
   *
   * @return Promise result Promise of statup result
   */
  start()
  {
    return this.getInitializationFlagsFromCache()
      .then((flags) => {
        this.initializeBasedOnFlags(flags);
      })
      .then(function() {
        logger.info("InitializeService: Initialization finished successfuly");
        logger.info("------------------------------------------------------");
      })
      .catch(function (error) {
        logger.error("InitializeService: Error occurred");
        logger.error(error.message, error);
      });
  }

  /**
   * Method fetches initialization flags
   *
   * @return object result Result object as following:
   * {
   *     "initialization_finished": true | null,
   *     "initialization_started": $startedTimestamp|null
   * }
   */
  getInitializationFlagsFromCache()
  {
    logger.info(
      "InitializeService: Getting initialization flags from cache " +
      "using ClusterService"
    );
    let flags = this.clusterService.use("cache").getInitializationFlags();
    return flags;
  }

  /**
   * Method initializes Redis/RE node based on passed initlization flags
   *
   * @param object result Result object as following:
   * {
   *     "initialization_finished": true | null,
   *     "initialization_started": $startedTimestamp|null
   * }
   * @return Promise result Promise of result
   */
  initializeBasedOnFlags(initializationFlags)
  {
    switch (this.getClusterInitializationState(initializationFlags)) {
    case "not started":
      logger.info(
          "InitializeService: Starting initialization" +
          "(as first RE node in cluster)"
        );
        return this.setInitializationStartFlag()
          .then(this.getDevicesWithRulesFromDb.bind(this))
          .then(this.storeDevicesInCache.bind(this))
          .then(this.setInitializationFinishedFlag.bind(this));
    case "running":
      logger.info(
          "InitializeService: Initialization is running " +
          "from different node - waiting 10 seconds"
        );
      throw new InitializeServiceError(
          "Other server is starting - edge case - please start server again"
        );

    case "finished":
      logger.info(
          "InitializeService: Initialization already done by different node" +
          "- doing nothing"
        );
        // return this.getDevicesListFromCache()
        //   .then(this.getDevicesFromCache.bind(this));
        //   .then(this.storeDevicesInMemory.bind(this));
      break;
    }
  }

  /**
   * Method decides about the state of cluster initialization
   *
   * @param object result Result object as following:
   * {
   *     "initialization_finished": true | null,
   *     "initialization_started": $startedTimestamp|null
   * }
   * @return string state State of cluster
   */
  getClusterInitializationState(initializationFlags)
  {
    logger.info(
      "InitializeService: Resolving claster initialization state using ClusterService"
    );

    return this.clusterService.getClusterInitializationState(initializationFlags);
  }

  /**
   * Methods sets initialization start flag in cache to current timestamp
   *
   * @return Promise result Promise of result
   */
  setInitializationStartFlag()
  {
    logger.info(
      "InitializeService: Setting initialization_started flag " +
      "in cache using ClusterService"
    );

    return this.clusterService.use("cache").setInitializationStartFlag();
  }

  /**
   * Method gets devices with rules from database
   *
   * @return Promise result Promise of result data
   */
  getDevicesWithRulesFromDb()
  {
    logger.info(
      "InitializeService: Getting devices with rules " +
      "from db using DeviceService"
    );

    return this.deviceService.use("db").getDevicesWithRules();
  }

  /**
   * Method generates hashes for each of passed devices
   *
   * @param object|array devices List of devices
   * @return object|array devices List of devices (with hashes)
   */
  generateDeviceHashes(devices)
  {
    logger.info(
      "InitializeService: Generating device hashes for passed devices" +
      "using DeviceService"
    );

    return this.deviceService.generateDeviceHashes(devices);
  }

  /**
   * Method returns list of device"s names stored in cache
   *
   * @return Promise result Promise of list (array) of device"s names stored
   * in cache
   */
  getDevicesListFromCache()
  {
    logger.info(
      "InitializationService: Getting device names list from cache"
    );

    return this.deviceService.use("cache").getDeviceNamesList();
  }

  /**
   * Method gets devices based on passed device"s names list
   *
   * @param array devicesList List of device"s names to be fetched from cache
   * @return Promise result Promise of returning list of fetched devices
   */
  getDevicesFromCache(devicesList)
  {
    logger.info(
      "InitializeService: Getting devices with rules " +
      "from cache using DeviceService"
    );

    return this.deviceService.use("cache").getDevicesWithRules(devicesList);
  }

  /**
   * Method stores devices in cache
   *
   * @param object devices List of devices
   * @return Promise result Promise of returning list of devices
   * (push forward for further usage)
   */
  storeDevicesInCache(devices)
  {
    logger.info(
      "InitializeService: Storing devices with rules " +
      "in cache using DeviceService"
    );

    return this.deviceService.use("cache").save(devices);
  }

  /**
   * Method stores devices in memory
   *
   * @param object devices List of devices
   * @return object devices List of devices (push forward for further usage)
   */
  storeDevicesInMemory(devices)
  {
    logger.info(
      "InitializeService: Storing devices with rules " +
      "in cache using DeviceService"
    );

    return this.deviceService.use("memory").save(devices);
  }

  /**
   * Method sets initialization finished flag in cache to "true"
   *
   * @return Promise result Promise of cache result
   */
  setInitializationFinishedFlag()
  {
    logger.info(
      "InitializeService: Setting initialization_finished " +
      "to true flag in cache"
    );

    return this.clusterService.use("cache").setInitializationFinishedFlag();
  }
}

module.exports = InitializeService;
