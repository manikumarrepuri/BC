
"use strict";

var GatewayError = require("itheon-gateway").GatewayError;
var _            = require("itheon-utility").underscore;
var BaseGateway  = require("./baseGateway");

class MemoryGateway extends BaseGateway
{
  constructor()
  {
    super();
    this.collections = {};
  }

  set(collection, key, value)
  {
    if (!_.isString(collection)) {
      throw new GatewayError(
        "Invalid collection passed. String expected",
        {
          collection: collection,
          key: key,
          value: value
        }
      );
    }

    if (!_.isString(key)) {
      throw new GatewayError(
        "Invalid key passed. String expected",
        {
          collection: collection,
          key: key,
          value: value
        }
      );
    }

    if (!_.isObject(this.collections[collection])) {
      this.collections[collection] = {};
    }

    this.collections[collection][key] = value;
    return new Promise(function(resolve, reject) {
      resolve(value);
    });
  }

  get(collection, key)
  {
    if (!_.isString(collection)) {
      throw new GatewayError(
        "Invalid collection passed. String expected",
        {
          collection: collection,
          key: key
        }
      );
    }

    if (!_.isObject(this.collections[collection])) {
      return new Promise(function(resolve, reject) {
        resolve(null);
      });
    }

    if (!key) {
      return new Promise(function(resolve, reject) {
        resolve(this.collections[collection]);
      }.bind(this));
    }

    if (_.has(this.collections[collection], key)) {
      return new Promise(function(resolve, reject) {
        resolve(this.collections[collection][key]);
      }.bind(this));
    }

    return new Promise(function(resolve, reject) {
      resolve(null);
    }.bind(this));
  }

  delete(collection, key)
  {
    if (!_.isString(collection)) {
      throw new GatewayError(
        "Invalid collection passed. String expected",
        {
          collection: collection,
          key: key
        }
      );
    }

    if (!_.isString(key)) {
      throw new GatewayError(
        "Invalid key passed. String expected",
        {
          collection: collection,
          key: key
        }
      );
    }

    if (!_.isObject(this.collections[collection])) {
      return this;
    }

    delete this.collections[collection][key];
    return new Promise(function(resolve, reject) {
      resolve(null);
    });
  }
}

module.exports = new MemoryGateway();
