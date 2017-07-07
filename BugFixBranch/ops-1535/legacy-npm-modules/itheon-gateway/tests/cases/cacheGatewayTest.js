"use strict";

var assert = require("assert");

var CacheGateway = require("../../lib/cacheGateway");
var Q = require('q');
var GatewayError = require("../../lib/gatewayError");
var redisDataProvider = require("itheon-data-provider").redisDataProvider;

describe('CacheGateway Test', () => {
  var client = require('redis-js').toPromiseStyle(Q.defer);
  var cacheGateway;

  beforeEach(() => {
    cacheGateway = undefined;
  });

  it('should throw if methods are not extended',
    () => {
      cacheGateway = new CacheGateway(client);
      assert.throws(() => { cacheGateway.set("", ""); }, GatewayError);
      assert.throws(() => { cacheGateway.get(""); }, GatewayError);
      assert.throws(() => { cacheGateway.delete(""); }, GatewayError);
    });
  
  it('should return the connection that was passed into the constructor', () => {
    client = "42";
    cacheGateway = new CacheGateway("42");
    assert.deepEqual(client, cacheGateway.cacheConnection);
  });
  
  it('should return the default redis Data Provider if no cacheConnection is supplied', () => {
    var connection = redisDataProvider.getRedisDataProvider();

    cacheGateway = new CacheGateway();
    assert.deepEqual(cacheGateway.cacheConnection, connection);
  });
});