
"use strict";

var _ = require("itheon-utility").underscore;

class BaseError extends Error {
  constructor(message, data, errorCode)
  {
    super(message);
    this.data = data;
    this.errorCode = errorCode;
  }

  exportDetails()
  {
    return {
      "type": this.constructor.name,
      "message": this.message,
      "errorCode": this.errorCode,
      "data" : this.data
    };
  }
}
class EntityError extends BaseError {}

class BaseEntity {
  constructor(data)
  {
    this.schema = {
      properties: {}
    };
    if (data) {
      this.inflate(data);
    }
  }
  inflate(data) {
    this.data = data;
    for (var key in data) {
      this[key] = data[key];
    }
  }
  get(property) {
    return this[property];
  }
  export() {
    return this.data;
  }
  setFields(fields) {
    this.schema.properties = fields;
  }
}

class AmqpDataProvider {
  
  constructor(queues) {
    this.queues = {};
    this.setQueues(queues);
  }

  setQueues(queues) {
    _.extend(this.queues, queues);
    return this;
  }

  sendToQueue(message) {  }

  subscribe(handler) {  }

  acknowledge(message) {  } 
  
  unacknowledge(message) {  }

  lazyConnect()
  {
    return;
  }
}

class DeviceMockGateway {
  constructor(dataProvider)
  {
    this.dataProvider = dataProvider;
  }

  getWithRules()
  {

  }

  save(device)
  {

  }

  saveHash(device, hash)
  {

  }
}

//Logger stub
module.exports.logger = {
  _log: function(level, message, data) {},
  log: function(level, message, data) {},
  info: function(message, data) {},
  silly: function(message, data) {},
  warn: function(message, data) {},
  error: function(message, data) {}
};

module.exports.DeviceMockGateway = DeviceMockGateway;
module.exports.AmqpDataProvider = AmqpDataProvider;
module.exports.BaseError = BaseError;
module.exports.EntityError = EntityError;
module.exports.baseEntity = BaseEntity;
