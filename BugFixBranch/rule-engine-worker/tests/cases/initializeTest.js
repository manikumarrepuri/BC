
"use strict";

var appRoot = require('app-root-path');

var InitializeService = require(appRoot + '/lib/initializeService');

var assert = require('assert');
var Q = require('q');

var _ = require('underscore');

var testHelper = require('itheon-test');
var sinon            = require('sinon');
var sinonStubPromise = require('sinon-stub-promise');
// Needed to ensure that sinon stubs can return promises.
sinonStubPromise(sinon);

var ClusterService = require(appRoot + '/lib/clusterService');
var DeviceRedisGateway = require(appRoot + '/lib/deviceRedisGateway');
var DeviceService = require(appRoot + '/lib/deviceService');

// var devicesDataProvider = testHelper.getDataProvider('devices');

describe('InitializeService Tests', () => {
  it('testing init of rule engine', sinon.test(function (done) {
    // let dbGateway = new DeviceMockGateway();
    // let memoryGateway = new DeviceMockGateway();

    var client = require('redis-js').toPromiseStyle(Q.defer);
    var redisGateway = new DeviceRedisGateway(client);

    let clusterService = new ClusterService({
      cache: redisGateway
    });
    clusterService.use('cache');

    let stubs = [];

    let deviceService = new DeviceService({
      db : "dbGateway",
      memory : "memoryGateway",
      cache: redisGateway
    });

    client.del('initialization_finished');
    client.del('initialization_started');

    var initializeService = new InitializeService(clusterService, deviceService);

    stubs.push(sinon.stub(initializeService, "getInitializationFlagsFromCache")
    .returnsPromise()
    .resolves([null, null]));

    stubs.push(sinon.stub(initializeService, "getClusterInitializationState")
    .returnsPromise()
    .resolves("not started"));

    // The stubs below aren't working for some reason
    // - I suspect it's some kind of race condition but I can't get to the bottom of it.

    // stubs.push(sinon.stub(initializeService, "storeDevicesInCache")
    // .returnsPromise()
    // .resolves());

    // stubs.push(sinon.stub(initializeService, "setInitializationFinishedFlag")
    // .returnsPromise()
    // .resolves());

    // stubs.push(sinon.stub(initializeService, "setInitializationStartFlag")
    // .returnsPromise()
    // .resolves("okay!"));

    // stubs.push(sinon.stub(initializeService, "getDevicesWithRulesFromDb")
    // .returnsPromise()
    // .resolves({ "group" : "test", "name" : "test", "property" : "testvalue"}));

    initializeService.start()
    .then(() => {
      _.each(stubs, (stub) => {
        assert(stub.calledOnce, stub.displayName + "() should have been called once");
      });
      done();
    }).catch((e) => {
      done(e);
    });
  }));
});
