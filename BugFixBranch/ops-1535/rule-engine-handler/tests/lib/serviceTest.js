
"use strict"

var appRoot = require('app-root-path');

var Service = require(appRoot + '/lib/service');

var memoryDbMapper = require(appRoot + '/lib/mapper/memory');

var TestHelper = require(appRoot + '/lib/test/helper');
var testHelper = new TestHelper(__filename);

var mappersListsDataProvider = testHelper.getDataProvider('mappersLists');

exports.testNewInstanceInvalidMappersVariable = function(test) {

  var cases = mappersListsDataProvider.invalidConstructorMappersList;

  var index, singleCase, mappersList, errorMessage;
  for (index in cases) {
    singleCase = cases[index];
    mappersList = singleCase.shift(singleCase);
    errorMessage = singleCase.shift(singleCase);
    try {

      var service = new Service(mappersList);

      test.equals(true, false, 'Passing invalid mappers list was successful..');

    } catch (exception) {

      test.equals(
        errorMessage,
        exception.message
      );

    }
  }

  test.done();
};

exports.testNewInstanceInvalidMappersVariable = function(test) {

  var cases = mappersListsDataProvider.invalidSetMappersList;

  var index, singleCase, mappersList, errorMessage;
  for (index in cases) {
    singleCase = cases[index];
    mappersList = singleCase.shift(singleCase);
    errorMessage = singleCase.shift(singleCase);
    try {

      var service = new Service();
      service.setMappers(mappersList);

      test.equals(true, false, 'Passing invalid mappers list was successful..');

    } catch (exception) {

      test.equals(
        errorMessage,
        exception.message
      );

    }
  }

  test.done();
};

exports.testNewInstanceValidMappers = function(test) {

  var service = new Service({
    'memory': memoryDbMapper
  });

  test.equals(null, service.getMapper());

  service.use('memory');

  test.equals(memoryDbMapper, service.getMapper());
  test.done();
};