"use strict";

var assert = require("assert");

var BaseGateway = require("../../lib/baseGateway");
var Q = require('q');

describe('BaseGateway Test', () => {
  var client = "Test String";
  var baseGateway;

  beforeEach(() => {
    baseGateway = new BaseGateway("Test String");
  });
  
  it('should return the connection that was passed into the constructor', () => {
    assert.deepEqual(baseGateway.dataProvider, client);
  });

  it('should set a new data provider via setRedisDataProvider()', () => {
    baseGateway.setDataProvider("A new test string.");
    assert.deepEqual(baseGateway.dataProvider, "A new test string.");
  });
  
  it('should return the cached data provider via getRedisDataProvider()', () => {
    baseGateway.setDataProvider(client);
    assert.deepEqual(baseGateway.getDataProvider(), client);
  });
});