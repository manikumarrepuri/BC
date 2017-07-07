"use strict";

var assert = require("assert");

var AmqpGateway = require("../../lib/amqpGateway");
var sinon = require("sinon");
var testHelper = require("itheon-test");
var AmqpDataProvider = testHelper.stubs.AmqpDataProvider;

describe('AmqpGateway Test', () => {
  let amqpGateway;
  
  beforeEach(() => {
    amqpGateway = new AmqpGateway(new AmqpDataProvider(), { sendTo: "queueName" });
  });

  it('should change the queueConnection when setQueueConnection() is called', () => {
    var testProvider = new AmqpDataProvider({ sendTo: "testData" });
    amqpGateway.setQueueConnection(testProvider);
    assert.deepEqual(amqpGateway.queueConnection, testProvider);
  });

  it('should set the queueConnection queues when setQueues() is called', () => {
    amqpGateway.setQueues({ sendTo: "setQueuesTest" });
    assert.deepEqual(amqpGateway.queueConnection.queues, { sendTo: "setQueuesTest" });
  });

  it('should throw an error if a queue object is not provided in the constructor', () => {
    assert.throws(function () { amqpGateway = new AmqpGateway(new AmqpDataProvider(), "");});
  });
  
  it('should send to the queue when save() is invoked', sinon.test(function () {
    var mock = this.mock(amqpGateway.queueConnection)
      .expects("sendToQueue") // method name
      .once()                 // called once
      .withArgs("test");      // with given args.

    amqpGateway.save("test");
    
    mock.verify();            // will throw if any expectations fail assert.
  }));

  it('should call subscribe() on the queue when it is invoked on the gateway', sinon.test(function () {
    var mock = this.mock(amqpGateway.queueConnection)
      .expects("subscribe")
      .once()
      .withArgs("subTest");
       
    amqpGateway.subscribe("subTest");

    mock.verify();
  }));

  it('should warn the if two parameters are passed to subscribe()', sinon.test(function () {
    var mock = this.mock(amqpGateway.queueConnection)
      .expects("subscribe")
      .once();
    
    var consoleMock = this.mock(console)
      .expects("warn")
      .once();
    
    amqpGateway.subscribe("", function () { });

    mock.verify();
    consoleMock.verify();
  }));

  it('should call acknowledge() on the queue when it is invoked on the gateway', sinon.test(function () {
    var mock = this.mock(amqpGateway.queueConnection)
      .expects("acknowledge")
      .once()
      .withArgs("ackTest");
       
    amqpGateway.acknowledge("ackTest");

    mock.verify();
  }));
  
  it('should call unacknowledge() on the queue when it is invoked on the gateway', sinon.test(function () {
    
    var mock = this.mock(amqpGateway.queueConnection)
      .expects("unacknowledge")
      .once()
      .withArgs("unackTest");
       
    amqpGateway.unacknowledge("unackTest");

    mock.verify();
  }));

});