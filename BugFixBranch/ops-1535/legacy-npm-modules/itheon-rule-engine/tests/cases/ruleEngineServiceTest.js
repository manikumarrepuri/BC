
"use strict";

var assert            = require('chai').assert;
var stubs             = require("itheon-test").stubs;
var proxyquire        = require('proxyquire');
var RuleEngineService =  proxyquire.noCallThru().load("../../lib/service/ruleEngineService", {
  "../lib/service/ruleEngineServiceError": stubs.BaseError,
  "itheon-entity":  stubs.baseEntity,
  "itheon-module-rule-entity": stubs.baseEntity,
  "itheon-utility": {
    '@noCallThru': false
  }
});

var DeviceEntity = stubs.baseEntity;
var RuleEntity = stubs.baseEntity;
var BaseEntity = stubs.baseEntity;
var dataProvider = require('./../dataProviders/ruleEngineService');

describe("Itheon Rule Engine - Rule Engine Service", function() {

  describe("validate entity with simple rule", function () {

    it("should return expected object", function () {

      var dataProvided = dataProvider.simpleRule();

      var index, interation;
      for (index in dataProvided) {

        interation = dataProvided[index];

        var expectedResult = interation.pop();
        var sampleRule = interation.pop();
        var device = interation.pop();

        var ruleEngineService = new RuleEngineService();
        var result = ruleEngineService.validate(device, sampleRule);

        assert.deepEqual(expectedResult, result, 'Function returned expected result object');
      }

    });

  });

  describe("validate entity with semi-complex rule", function () {

    it("should return expected object", function () {

      var dataProvided = dataProvider.semiComplexRule();

      var index, interation;
      for (index in dataProvided) {

        interation = dataProvided[index];

        var expectedResult = interation.pop();
        var sampleRule = interation.pop();
        var device = interation.pop();

        var ruleEngineService = new RuleEngineService();
        var result = ruleEngineService.validate(device, sampleRule);

        assert.deepEqual(expectedResult, result, 'Function returned expected result object');
      }

    });

  });

  describe("validate entity with complex rule", function () {

    it("should return expected object", function () {

      var dataProvided = dataProvider.complexRule();

      var index, interation;
      for (index in dataProvided) {

        interation = dataProvided[index];

        var expectedResult = interation.pop();
        var sampleRule = interation.pop();
        var device = interation.pop();

        var ruleEngineService = new RuleEngineService();
        var result = ruleEngineService.validate(device, sampleRule);

        assert.deepEqual(expectedResult, result, 'Function returned expected result object');
      }

    });

  });

  describe("validate entity with entity metrics", function () {

    it("should return expected object", function () {

      var dataProvided = dataProvider.entityRule();

      var index, interation;
      for (index in dataProvided) {

        interation = dataProvided[index];

        var expectedResult = interation.pop();
        var sampleRule = interation.pop();
        var device = interation.pop();

        var ruleEngineService = new RuleEngineService();
        var result = ruleEngineService.validate(device, sampleRule);

        assert.deepEqual(result, expectedResult, 'Function returned expected result object');
      }

    });

  });

  describe("validate entity with entity metrics starts with", function () {

    it("should return expected object", function () {

      var dataProvided = dataProvider.entityRule();

      var index, interation;
      for (index in dataProvided) {

        interation = dataProvided[index];

        var expectedResult = interation.pop();
        var sampleRule = interation.pop();
        var device = interation.pop();

        var ruleEngineService = new RuleEngineService();
        var result = ruleEngineService.validate(device, sampleRule);

        assert.deepEqual(result, expectedResult, 'Function returned expected result object');
      }

    });

  });

  describe("validate entity without device", function () {

    it("should throw descriptive error", function () {

      var ruleEngineService = new RuleEngineService();

      assert.throws(function() {
        ruleEngineService.validate();
      }, 'Invalid device passed. Instance of Device expected');

    });

  });

});

module.exports.testvalidateEntityWithoutRule = function(test) {

  var ruleEngineService = new RuleEngineService();

  var device = new DeviceEntity();

  try {
    var result = ruleEngineService.validate(device);
  } catch(exception) {
    test.equal(
      'Invalid rule passed. Instance of Rule expected',
      exception.message
    );
    test.done();
  }
};

module.exports.testvalidateEntityWithoutRuleThresholds = function(test) {

  var ruleEngineService = new RuleEngineService();

  var device = new DeviceEntity();

  var rule = new RuleEntity();

  try {
    var result = ruleEngineService.validate(device, rule);
  } catch(exception) {
    test.equal(
      'Invalid rule passed. Thresholds list is missing or empty',
      exception.message
    );
    test.done();
  }
};

module.exports.testvalidateEntityMissingMetric = function(test) {

  var ruleEngineService = new RuleEngineService();

  var device = new DeviceEntity();

  var rule = new RuleEntity({
    definition: {
      cpuBusy: {
        "$gt": "cpuMax"
      }
    },
    thresholds: {
      severity1: {
        cpuMax: 40
      }
    }
  });

  try {
    var result = ruleEngineService.validate(device, rule);
  } catch(exception) {
    test.equal(
      'Unable to locate metric required by rule : cpuBusy',
      exception.message
    );
    test.done();
  }
};

module.exports.testvalidateEntityMissingMetric = function(test) {

  var ruleEngineService = new RuleEngineService();

  var device = new DeviceEntity();

  var rule = new RuleEntity({
    definition: {
      cpuBusy: {
        "$gt": "cpuMax"
      }
    },
    thresholds: {
      severity1: {
        cpuMax: 40
      }
    }
  });

  try {
    var result = ruleEngineService.validate(device, rule);
  } catch(exception) {
    test.equal(
      'Unable to locate "cpuBusy" metric required by rule',
      exception.message
    );
    test.done();
  }
};

module.exports.testvalidateEntityInvalidRuleOperator = function(test) {

  var ruleEngineService = new RuleEngineService();

  var device = new DeviceEntity({
    metrics: {
      cpuBusy: {
        name: 'cpuBusy',
        value: 55
      }
    }
  });

  var rule = new RuleEntity({
    definition: {
      cpuBusy: {
        "invalid": "cpuMax"
      }
    },
    thresholds: {
      severity1: {
        cpuMax: 40
      }
    }
  });

  try {
    var result = ruleEngineService.validate(device, rule);
  } catch(exception) {
    test.equal(
      'Invalid operator passed for cpuBusy : invalid',
      exception.message
    );
    test.done();
  }
};

module.exports.testvalidateEntityMissingThresholdVariable = function(test) {

  var ruleEngineService = new RuleEngineService();

  var device = new DeviceEntity({
    metrics: {
      cpuBusy: {
        name: 'cpuBusy',
        value: 55
      }
    }
  });

  var rule = new RuleEntity({
    definition: {
      cpuBusy: {
        "$gt": "invalid"
      }
    },
    thresholds: {
      severity1: {
        cpuMax: 40
      }
    }
  });

  try {
    var result = ruleEngineService.validate(device, rule);
  } catch(exception) {
    test.equal(
      'Unable to locate "invalid" variable for "cpuBusy" metric',
      exception.message
    );
    test.done();
  }
};
