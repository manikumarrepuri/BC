"use strict";


var appRootPath      = require('app-root-path');
var assert           = require("chai").assert;
var common           = require('opserve-common');
var _                = common.utilities.underscore;

//dataProvider
var dataProvider     = require(appRootPath + '/tests/dataProviders/lib/module/receiver/service/receiverServiceTestData');

// services
var ReceiverService  = require(appRootPath + '/lib/module/receiver/service/receiverService');
var Receivers        = require('require-all')(appRootPath + '/lib/module/receiver/receivers');

var sinon            = require('sinon');
var sinonStubPromise = require('sinon-stub-promise');

var receiversData    = require(appRootPath + '/tests/dataProviders/lib/module/receiver/service/receiversTestData');

// Needed to ensure that sinon stubs can return promises.
sinonStubPromise(sinon);

describe("ReceiverService - Tests", function () {
  it("Check correct mappers are selected", function (done) {
    var dataProvided = dataProvider.validMappers();
    var index, interation;
    for (index in dataProvided) {
      interation = dataProvided[index];

      var expectedResult = interation.pop();
      var string = interation.pop();

      var receiverService = new ReceiverService(string);
      var result = receiverService.parse();

      assert.equal(result.mapperName, expectedResult, 'Function returned expected result object');
    }

    done();
  });

  it("Check validate data is parsed as expected", function (done) {
    var dataProvided = dataProvider.validParseableData();
    var index, interation;
    for (index in dataProvided) {
      interation = dataProvided[index];

      var expectedResult = interation.pop();
      var string = interation.pop();

      var receiverService = new ReceiverService(string);
      var result = receiverService.parse();

      assert.deepEqual(result.columns, expectedResult, 'Function returned expected result object');
    }

    done();
  });

  it("Check no data receiver is found for invalid message", function (done) {
    var dataProvided = dataProvider.invalidInput();
    var index, interation;
    for (index in dataProvided) {

      interation = dataProvided[index];

      var expectedResult = interation.pop();
      var string = interation.pop();

      var receiverService = new ReceiverService(string);
      var result = receiverService.getReceiver();

      assert.equal(null, result);
    }

    done();
  });

  it("Check splitter function throws error when no mapper is found", function (done) {
    var dataProvided = dataProvider.invalidMappers();
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
      } catch (e) {
        assert.equal(expectedResult, e.message);
        continue;
      }

      assert.ok(false);
    }

    done();
  });

});

describe("Receivers - Tests", function () {

  it("Check valid data is converted to generic object as expected", function (done) {
    var dataProvided = dataProvider.validEntities();
    var index, interation;
    for (index in dataProvided) {
      interation = dataProvided[index];

      var expectedResult = interation.pop();
      var receiverName = interation.pop();
      var entity = interation.pop();
      var receiver = new Receivers[receiverName]();
      //Generate generic object
      var result = receiver.generateEntity(entity);

      assert.deepEqual(result, expectedResult, 'Function returned expected result object');
    }

    done();
  });

  it("Check invalid data throws error as expected", function (done) {
    var dataProvided = dataProvider.invalidEntities();
    var index, interation;
    for (index in dataProvided) {
      interation = dataProvided[index];

      var receiverName = interation.pop();
      var entity = interation.pop();

      var receiver = new Receivers[receiverName]();
      //Generate generic object
      assert.throws(receiver.generateEntity(entity), 'Invalid request. No metrics generated.');
    }

    done();
  });

  describe('iamReceiver Test', () => {
    let receiver;
    beforeEach(() => {
      receiver = new Receivers["iamReceiver"]();
    });

    it('should save a given entity to the amqpGateway ', sinon.test(function () {
      let testData = _.findWhere(receiversData, {
        name: 'CASEONE'
      });
      let mock = this.mock(receiver.amqpGateway)
        .expects("save")
        .once()
        .withArgs(testData.entity);

      receiver.process(testData.entity);

      mock.verify();
    }));

    _.each(["system:cpuBusy", "system:physicalMemoryUsed", "system:systemAspUsed", "windows disk", "unix disk"],
      (metric) => {
        it('should push metrics that have ' + metric + ' to the frontend api ', sinon.test(function () {
          let testData = _.findWhere(receiversData, {
            name: metric
          });

          let stubs = [];

          var httpSetUrlStub = sinon.stub(receiver.httpGateway, "setUrl");
          httpSetUrlStub
            .withArgs("/api/devices")
            .returnsPromise()
            .resolves("200 OK");
          stubs.push(httpSetUrlStub);

          var httpSaveStub = sinon.stub(receiver.httpGateway, "save");
          httpSaveStub
            .returnsPromise()
            .resolves("200 OK");
          stubs.push(httpSaveStub);

          var hGetStub = sinon.stub(receiver.redisGateway, "hget");
          hGetStub
            .returnsPromise()
            .resolves(["tag", "tag2", "tag3"]);
          stubs.push(hGetStub);

          var hmsetStub = sinon.stub(receiver.redisGateway, "hmset");
          hmsetStub
            .returnsPromise()
            .resolves("OK!");

          stubs.push(hmsetStub);

          receiver.process(testData.entity);
          _.each(stubs, (stub) => {
            assert(stub.calledOnce, stub.displayName + "() should have been called once");
          });
        }));
      });
  });

  describe('iamAnnounce Test', () => {
    let receiver;
    beforeEach(() => {
      receiver = new Receivers["iamAnnounce"]();
    });

    it('should push announce entities to the frontend API', sinon.test(function () {

      let testData = _.findWhere(receiversData, {
        name: "iamAnnounceTest" });

      let stubs = [];

      var httpSetUrlStub = sinon.stub(receiver.httpGateway, "setUrl");
      httpSetUrlStub
        .withArgs("/api/devices")
        .returnsPromise()
        .resolves("200 OK");
      stubs.push(httpSetUrlStub);

      var httpSaveStub = sinon.stub(receiver.httpGateway, "save");
      httpSaveStub
        .returnsPromise()
        .resolves("200 OK");
      stubs.push(httpSaveStub);

      var hGetStub = sinon.stub(receiver.redisGateway, "hget");
      hGetStub
        .returnsPromise()
        .resolves(["tag", "tag2", "tag3"]);
      stubs.push(hGetStub);

      var hmsetStub = sinon.stub(receiver.redisGateway, "hmset");
      hmsetStub
        .returnsPromise()
        .resolves("OK!");

      stubs.push(hmsetStub);

      receiver.process(testData.entity);

      _.each(stubs, (stub) => {
        assert(stub.calledOnce, stub.displayName + "() should have been called once");
      });
    }));
  });

  describe('iamReminder Tests', () => {
    let receiver;
    beforeEach(() => {
      receiver = new Receivers["iamReminder"]();
    });

    it('should push reminder entities to the frontend API', sinon.test(function () {

      // There's not much logic in the process method,
      // so we don't need to have a specific entity to test.
      let testData = _.findWhere(receiversData, {
        name: "CASEONE" });

      let stubs = [];

      var httpSetUrlStub = sinon.stub(receiver.httpGateway, "setUrl");
      httpSetUrlStub
        .withArgs("/api/devices")
        .returnsPromise()
        .resolves("200 OK");
      stubs.push(httpSetUrlStub);

      var httpSaveStub = sinon.stub(receiver.httpGateway, "insert");
      httpSaveStub
        .returnsPromise()
        .resolves("200 OK");
      stubs.push(httpSaveStub);

      receiver.process(testData.entity);

      _.each(stubs, (stub) => {
        assert(stub.calledOnce, stub.displayName + "() should have been called once");
      });
    }));
  });

});
