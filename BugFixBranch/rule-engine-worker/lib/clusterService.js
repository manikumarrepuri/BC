
"use strict";

var appRoot = require("app-root-path");
var moment  = require("moment");
const common = require("opserve-common");
const logger = common.logger;
const RedisGateway = common.gateway.RedisGateway;
const clusterServiceError = common.error.ClusterServiceError;
var BaseService         = require("itheon-service").BaseService;

class ClusterService extends BaseService
{

  /**
   * Custom constructor allows to set gateways
   *
   * @param object gateways List of gateways to assign
   * keys (cache)
   */
  constructor(gateways)
  {
    super();

    if (!gateways) {
      gateways = {};
    }

    if (!gateways.hasOwnProperty("cache")) {
      gateways.cache = new RedisGateway();
    }

    this.setGateways(gateways);
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
  getInitializationFlags()
  {
    logger.info(
      "ClusterService: Getting initialization flags " +
      "from " + this.getGatewayName()
    );

    return this.getGateway().mget([
      "initialization_finished",
      "initialization_started"
    ]);
  }

  /**
   * Methods sets initialization start flag in cache to current timestamp
   *
   * @return Promise result Promise of result
   */
  setInitializationStartFlag()
  {
    var currentTimestamp = new Date().getTime();

    logger.info(
      "ClusterService: Setting initialization_started flag to " +
      currentTimestamp
    );

    return this.getGateway().set(
      "initialization_started",
      currentTimestamp
    );
  }

  /**
   * Method sets initialization finished flag in cache to "true"
   *
   * @return Promise result Promise of cache result
   */
  setInitializationFinishedFlag()
  {
    logger.info(
      "ClusterService: Setting initialization_finished " +
      "to true flag in " + this.getGatewayName()
    );

    return this.getGateway().set(
      "initialization_finished",
      "true"
    );
  }

  /**
   * Method sets key => value pair via current gateway
   *
   * @param string key   Key to store value under
   * @param string value Value store under the key
   * @return Promise result Result of storing
   */
  set(key, value)
  {
    logger.info(
      "ClusterService: Storing " + key + " in " + this.getGatewayName()
    );

    return this.getGateway().set(key, value);
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
      "ClusterService: Resolving cluster initialization state " +
      "based on passed initialization flags",
      initializationFlags
    );

    var started  = initializationFlags.initialization_started;
    var finished = initializationFlags.initialization_finished;

    if (started) {
      var initializationStarted = moment.unix(started);
      var currentDate = moment.unix(new Date().getTime());
    }

    if ((!finished && !started) ||
      (!finished && initializationStarted && currentDate.diff(initializationStarted, "seconds") > 60 * 1000)
    ) {
      return "not started";
    }

    if (started && !finished &&
      (initializationStarted && currentDate.diff(initializationStarted, "seconds") < 60 * 1000)
    ) {
      return "running";
    }

    if (finished) {
      return "finished";
    }

    throw new ClusterServiceError(
      "Unable to resolve current state of cluster"
    );
  }
}

module.exports = ClusterService;
