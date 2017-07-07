
"use strict"

var appRoot = require('app-root-path');

var ReceiverService = require(appRoot + '/lib/module/receiver/service/receiver');
var Receivers = require(appRoot + '/lib/module/receiver/config/receivers');

var Receiver = require(appRoot + '/lib/module/receiver/entity/receiver');
var Metric = require(appRoot + '/lib/module/device/entity/metric');
var Performance = require(appRoot + '/lib/module/receiver/entity/performance');

var dataProvider = require(appRoot + '/tests/dataProviders/lib/module/receiver/service/receiverService');

exports.testValidateData = function(test) {

  var dataProvided = dataProvider.validData();
  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var expectedResult = interation.pop();
    var string = interation.pop();

    var receiverService = new ReceiverService(string);
    var result = receiverService.parse();
    result = result.export();

    test.deepEqual(result, expectedResult, 'Function returned expected result object');
  }

  test.done();
};

exports.testCorrectDataReceiverIsSelected = function(test) {

  var dataProvided = dataProvider.validReceivers();
  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var expectedResult = interation.pop();
    var string = interation.pop();

    var receiverService = new ReceiverService(string);
    var result = receiverService.getReceiver();

    test.deepEqual(result, expectedResult, 'Function returned expected result object');
  }

  test.done();
};

exports.testGetReceiverNoDataReceiverIsSelected = function(test) {

  var dataProvided = dataProvider.invalidInput();
  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var expectedResult = interation.pop();
    var string = interation.pop();

    var receiverService = new ReceiverService(string);
    var result = receiverService.getReceiver();

    test.equal(null, result);
  }

  test.done();
};

exports.testParseNoDataReceiverIsSelected = function(test) {

  var dataProvided = dataProvider.invalidInput();
  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var expectedResult = interation.pop();
    var string = interation.pop();

    var receiverService = new ReceiverService(string);

    try {
      var result = receiverService.parse();
    }
    catch(e) {
      test.equal(expectedResult, e.message);
      continue;
    }

    test.ok(false);
  }

  test.done();
};

exports.testSplitterNoMapperIsSelected = function(test) {

  var dataProvided = dataProvider.invalidTables();
  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var expectedResult = interation.pop();
    var receiver = interation.pop();
    var string = interation.pop();

    var receiverService = new ReceiverService(string);
    receiverService.setReceiver(receiver);

    try {
      var result = receiverService.splitter();
      console.log(result);
    }
    catch(e) {
      test.equal(expectedResult, e.message);
      continue;
    }

    test.ok(false);
  }

  test.done();
};