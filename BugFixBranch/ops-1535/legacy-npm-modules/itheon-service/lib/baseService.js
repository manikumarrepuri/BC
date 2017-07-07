
"use strict";

var _            = require("itheon-utility").underscore;
var ServiceError = require("./serviceError");

class BaseService
{
  /**
   * Custom constructor provides a way to set gateways
   *
   * @param object gateways List of custom gateways
   */
  constructor(gateways)
  {
    if (typeof gateways !== "undefined") {
      this.setGateways(gateways);
    }
  }

  /**
   * Method assigns passed gateway to service
   *
   * @param object gateways List of gateways to assign
   * @return self this Fluent interface
   */
  setGateways(gateways)
  {
    if (!_.isObject(gateways) || _.isArray(gateways)) {
      throw new ServiceError(
        "Invalid list of gateways passed. " +
        "GatewayName => GatewayObject list expected"
      );
    }

    if (_.isEmpty(gateways)) {
      throw new ServiceError(
        "Invalid list of gateways passed. Non-empty list expected"
      );
    }

    var re = /^[a-zA-Z]+$/;
    _(gateways).forEach(function(gateway, gatewayName) {

      if (!re.test(gatewayName)) {
        throw new ServiceError(
          "Invalid gateway name passed: " + gatewayName + ". a-zA-Z pattern expected"
        );
      }
    });

    this.gateways = gateways;
    return this;
  }

  /**
   * Method changes current gateway to one referenced by name as argument
   *
   * @param string gatewayName Name of gateway to switch to
   * @return self this Fluent interface
   */
  use(gatewayName)
  {
    if (!_.isString(gatewayName)) {
      throw new ServiceError(
        "Invalid gateway name passed. String expected"
      );
    }

    if (!this.gateways.hasOwnProperty(gatewayName)) {
      throw new ServiceError(
        "Unable to locate " + gatewayName +  " gateway"
      );
    }

    this.gateway = this.gateways[gatewayName];
    this.gatewayName = gatewayName;

    return this;
  }

  /**
   * Method returns current gateway
   *
   * @return BaseGateway gateway Current gateway
   */
  getGateway()
  {
    return this.gateway;
  }

  /**
   * Method returns current gateway name
   *
   * @return string gatewayName Current gateway name
   */
  getGatewayName()
  {
    return this.gatewayName;
  }
}

module.exports = BaseService;

