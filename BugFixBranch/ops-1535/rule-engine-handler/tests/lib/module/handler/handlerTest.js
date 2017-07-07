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

    try {
      var handlerClass = require(appRoot + '/lib/module/subscriber/subscribers/'+handler.type);
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

    var expectedResult = interation.pop();
    var handler = interation.pop();
    var eventObject = interation.pop();

    try {
      var handlerClass = require(appRoot + '/lib/module/subscriber/subscribers/'+handler.type);
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

