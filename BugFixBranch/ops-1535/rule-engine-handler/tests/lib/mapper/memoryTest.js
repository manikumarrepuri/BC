
"use strict"

var appRoot = require('app-root-path');

var memoryMapper = require(appRoot + '/lib/mapper/memory');
var Mapper       = require(appRoot + '/lib/mapper');

exports.testExtendsBaseMapper = function(test) {
  test.ok(memoryMapper instanceof Mapper);
  test.done();
};

exports.testGetExistingKey = function(test) {

  var specialObject = {a: "b", d: "e"};
  memoryMapper.set('devices', 'test', specialObject)
    .then(function() {
      return memoryMapper.get('devices', 'test');
    }).then(function(result) {
      test.equals(specialObject, result);
      test.done();
    });
};

exports.testGetExistingCollection = function(test) {

  var specialObject1 = {a: "b", d: "e"};
  var specialObject2 = {a: "b", d: "x"};
  memoryMapper.set('specialCollection', 'object1', specialObject1)
    .then(function() {
      return memoryMapper.set('specialCollection', 'object2', specialObject2);
    }).then(function() {
      return memoryMapper.get('specialCollection');
    }).then(function(result) {
      test.deepEqual({
          object1: specialObject1,
          object2: specialObject2
        },
        result
      );
      test.done();
    });
};

exports.testUpdateExistingKey = function(test) {

  var specialObject = {a: "b", d: "e"};
  var updatedObject = {a: "b", d: "x"};
  memoryMapper.set('devices', 'test', specialObject)
    .then(function() {
      return memoryMapper.get('devices', 'test');
    }).then(function() {
      return memoryMapper.set('devices', 'test', updatedObject);
    }).then(function() {
      return memoryMapper.get('devices', 'test');
    }).then(function(result) {
      test.notEqual(specialObject, result);
      test.equals(updatedObject, result);
      test.done();
    });
};

exports.testGetNonExistingCollection = function(test) {

  memoryMapper.get('nonExisting', 'nonExisting')
    .then(function(result) {
      test.equals(null, result);
      test.done();
    });
};

exports.testGetNonExistingKey = function(test) {

  memoryMapper.set('devices', 'test', {})
    .then(function() {
      return memoryMapper.get('devices', 'nonExisting');
    }).then(function(result) {
      test.equals(null, result);
      test.done();
    });
};

exports.testTryingDifferentMappers = function(test) {

  var memoryMapper1 = require(appRoot + '/lib/mapper/memory');
  var memoryMapper2 = require(appRoot + '/lib/mapper/memory');

  var specialObject = {a: "b"};

  memoryMapper1.set('devices', 'test', specialObject)
    .then(function() {
      return memoryMapper2.get('devices', 'test');
    }).then(function(result) {
      test.equals(specialObject, result);
      test.done();
    });
};