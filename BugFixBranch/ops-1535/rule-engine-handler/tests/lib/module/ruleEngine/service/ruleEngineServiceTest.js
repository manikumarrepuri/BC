
"use strict"

var appRoot = require('app-root-path');

var RuleEngineService = require(appRoot + '/lib/module/ruleEngine/service/ruleEngine');

var Metric = require(appRoot + '/lib/module/device/entity/metric');
var Device = require(appRoot + '/lib/module/device/entity/device');
var Rule   = require(appRoot + '/lib/module/rule/entity/rule');

var dataProvider = require(appRoot + '/tests/dataProviders/lib/module/ruleEngine/service/ruleEngineService');

exports.testValidateDeviceWithSimpleRuleViaConstructor = function(test) {

  var dataProvided = dataProvider.simpleRule();

  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var expectedResult = interation.pop();
    var sampleRule = interation.pop();
    var device = interation.pop();

    var ruleEngineService = new RuleEngineService(device, sampleRule);
    var result = ruleEngineService.validateDevice();

    var resultData = {
      'code': result.get('code'),
      'severity': result.get('severity')
    }

    test.deepEqual(resultData, expectedResult, 'Function returned expected result object');
  }

  test.done();
};

exports.testValidateDeviceWithSimpleRuleViaMethod = function(test) {

  var dataProvided = dataProvider.simpleRule();

  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var expectedResult = interation.pop();
    var sampleRule = interation.pop();
    var device = interation.pop();

    var ruleEngineService = new RuleEngineService();
    var result = ruleEngineService.validateDevice(device, sampleRule);

    var resultData = {
      'code': result.get('code'),
      'severity': result.get('severity')
    }

    test.deepEqual(resultData, expectedResult, 'Function returned expected result object');
  }

  test.done();
};

exports.testValidateDeviceWithSemiComplexRuleViaConstructor = function(test) {

  var dataProvided = dataProvider.semiComplexRule();

  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var expectedResult = interation.pop();
    var sampleRule = interation.pop();
    var device = interation.pop();

    var ruleEngineService = new RuleEngineService(device, sampleRule);
    var result = ruleEngineService.validateDevice();

    var resultData = {
      'code': result.get('code'),
      'severity': result.get('severity')
    }

    test.deepEqual(resultData, expectedResult, 'Function returned expected result object');
  }

  test.done();
};

exports.testValidateDeviceWithSemiComplexRuleViaMethod = function(test) {

  var dataProvided = dataProvider.semiComplexRule();

  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var expectedResult = interation.pop();
    var sampleRule = interation.pop();
    var device = interation.pop();

    var ruleEngineService = new RuleEngineService();
    var result = ruleEngineService.validateDevice(device, sampleRule);

    var resultData = {
      'code': result.get('code'),
      'severity': result.get('severity')
    }

    test.deepEqual(resultData, expectedResult, 'Function returned expected result object');
  }

  test.done();
};

exports.testValidateDeviceWithComplexRuleViaConstructor = function(test) {

  var dataProvided = dataProvider.complexRule();

  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var expectedResult = interation.pop();
    var sampleRule = interation.pop();
    var device = interation.pop();

    var ruleEngineService = new RuleEngineService(device, sampleRule);
    var result = ruleEngineService.validateDevice();

    var resultData = {
      'code': result.get('code'),
      'severity': result.get('severity')
    }

    test.deepEqual(resultData, expectedResult, 'Function returned expected result object');
  }

  test.done();
};

exports.testValidateDeviceWithComplexRuleViaMethod = function(test) {

  var dataProvided = dataProvider.complexRule();

  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var expectedResult = interation.pop();
    var sampleRule = interation.pop();
    var device = interation.pop();

    var ruleEngineService = new RuleEngineService();
    var result = ruleEngineService.validateDevice(device, sampleRule);

    var resultData = {
      'code': result.get('code'),
      'severity': result.get('severity')
    }

    test.deepEqual(resultData, expectedResult, 'Function returned expected result object');
  }

  test.done();
};

exports.testValidateDeviceWithEntityMetrics = function(test) {

  var dataProvided = dataProvider.entityRule();

  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var expectedResult = interation.pop();
    var sampleRule = interation.pop();
    var device = interation.pop();

    var ruleEngineService = new RuleEngineService();
    var result = ruleEngineService.validateDevice(device, sampleRule);

    var resultData = {
      'code': result.get('code'),
      'severity': result.get('severity')
    }

    test.deepEqual(resultData, expectedResult, 'Function returned expected result object');
  }

  test.done();
};

exports.testValidateDeviceWithoutDevice = function(test) {

  var ruleEngineService = new RuleEngineService();

  try {
    var result = ruleEngineService.validateDevice();
  } catch(exception) {
    test.equal(
      'Invalid device passed. Instance of Device expected',
      exception.message
    );
    test.done();
  }
};

exports.testValidateDeviceWithoutRule = function(test) {

  var ruleEngineService = new RuleEngineService();

  var device = new Device();

  try {
    var result = ruleEngineService.validateDevice(device);
  } catch(exception) {
    test.equal(
      'Invalid rule passed. Instance of Rule expected',
      exception.message
    );
    test.done();
  }
};

exports.testValidateDeviceWithoutRuleThresholds = function(test) {

  var ruleEngineService = new RuleEngineService();

  var device = new Device();

  var rule = new Rule();

  try {
    var result = ruleEngineService.validateDevice(device, rule);
  } catch(exception) {
    test.equal(
      'Invalid rule passed. Thresholds list is missing or empty',
      exception.message
    );
    test.done();
  }
};

exports.testValidateDeviceMissingMetric = function(test) {

  var ruleEngineService = new RuleEngineService();

  var device = new Device();

  var rule = new Rule({
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
    var result = ruleEngineService.validateDevice(device, rule);
  } catch(exception) {
    test.equal(
      'Unable to locate metric required by rule : cpuBusy',
      exception.message
    );
    test.done();
  }
};

exports.testValidateDeviceMissingMetric = function(test) {

  var ruleEngineService = new RuleEngineService();

  var device = new Device();

  var rule = new Rule({
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
    var result = ruleEngineService.validateDevice(device, rule);
  } catch(exception) {
    test.equal(
      'Unable to locate cpuBusy metric required by rule',
      exception.message
    );
    test.done();
  }
};

exports.testValidateDeviceInvalidRuleOperator = function(test) {

  var ruleEngineService = new RuleEngineService();

  var device = new Device({
    metrics: {
      cpuBusy: {
        name: 'cpuBusy',
        value: 55
      }
    }
  });

  var rule = new Rule({
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
    var result = ruleEngineService.validateDevice(device, rule);
  } catch(exception) {
    test.equal(
      'Invalid operator passed for cpuBusy : invalid',
      exception.message
    );
    test.done();
  }
};

exports.testValidateDeviceMissingThresholdVariable = function(test) {

  var ruleEngineService = new RuleEngineService();

  var device = new Device({
    metrics: {
      cpuBusy: {
        name: 'cpuBusy',
        value: 55
      }
    }
  });

  var rule = new Rule({
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
    var result = ruleEngineService.validateDevice(device, rule);
  } catch(exception) {
    test.equal(
      'Unable to locate "invalid" variable for "cpuBusy" metric',
      exception.message
    );
    test.done();
  }
};
