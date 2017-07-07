"use strict"

var appRoot = require('app-root-path');
var dataProvider = require(appRoot + '/tests/dataProviders/lib/module/subscriber/provider');

var Event = require(appRoot + '/lib/module/subscriber/entity/event');

exports.testHandlerWithValidData = function(test) {

  var dataProvided = dataProvider.validData();

  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var handler = interation.pop();
    var eventObject = interation.pop();

    if(handler.type != 'itheonEvent') continue;

    try {
      var handlerClass = require(appRoot + '/lib/module/subscriber/subscribers/itheonEvent');
      var result = new handlerClass(eventObject, handler.settings);
    }
    catch(e) {
      test.ok(false);
      continue;
    }

    //Attempt to remove the file if created
    if(typeof result.removeFile === 'function') result.removeFile();
    test.ok(true);
  }

  test.done();
};

exports.testHandlerWithInvalidData = function(test) {

  var dataProvided = dataProvider.invalidData();

  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var handler = interation.pop();
    var eventObject = interation.pop();

    if(handler.type != 'itheonEvent') continue;

    try {
      var handlerClass = require(appRoot + '/lib/module/subscriber/subscribers/itheonEvent');
      var result = new handlerClass(eventObject, handler.settings);
    }
    catch(e) {
      test.equal('Invalid event passed. Instance of Event expected',e.message);
      continue;
    }

    test.ok(true);
  }

  test.done();
};

exports.testcreateEventObjectWithValidData = function(test) {

  var dataProvided = dataProvider.validEventObjectData();

  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var expectedResult = interation.pop();
    var handlerConfig = interation.pop();
    var eventObject = interation.pop();

    if(handlerConfig.type != 'itheonEvent') continue;

    try {
      var handlerClass = require(appRoot + '/lib/module/subscriber/subscribers/itheonEvent');
      var handler = new handlerClass(eventObject, handlerConfig.settings);
      var result = handler.createEventObject();
    }
    catch(e) {
      test.ok(false);
      continue;
    }

    test.deepEqual(result,expectedResult);
  }

  test.done();
};

/*
exports.testConvertObjtoArray = function(test) {

  var dataProvided = dataProvider.validData();
  var interation = dataProvided[0];

  var expectedResult = interation.pop();
  var handlerConfig = interation.pop();
  var eventObject = interation.pop();

  try {
    var handlerClass = require(appRoot + '/lib/module/subscriber/subscribers/itheonEvent');
    var handler = new handlerClass(eventObject, handlerConfig.settings);
    var result = handler.ConvertObjtoArray();
  }
  catch(e) {
    test.ok(false);
  }

  test.deepEqual(result,expectedResult);
  test.done();
};
*/
