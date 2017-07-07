
"use strict"

var appRoot = require('app-root-path');
var _       = require('underscore');

var SubscriberService = require(appRoot + '/lib/module/subscriber/service/subscriber');
var EventEntity = require(appRoot + '/lib/module/subscriber/entity/event');

//var dataProvider = require(appRoot + '/tests/dataProviders/lib/module/receiver/service/receiverService');

exports.testValidateData = function(test) {

  //var dataProvided = dataProvider.validData();
  var dataProvided = [
  {
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "rule_name",
    entity: "",
    brief: "some brief",
    fullText: "some full text {cpuBusy}",
    occurrences:  0,
    firstOccurrence: "123456789",
    lastOccurrence: "123456789",
    severity: 4,
    state: "N",
    subscribers: [
      "itheon7.xProblemEvent",
      "itheon10.xProblemEvent"
    ]
  }];

  var index, interation;
  for (index in dataProvided) {

    interation = dataProvided[index];

    var eventEntity = new EventEntity(interation);
    var subscriberService = new SubscriberService(eventEntity);

    //Loop through subscriber and process request
    _.each(eventEntity.get('subscribers'), function(subscriber,index){
      subscriberService.handleSubscribers(subscriber);
    });

    //test.deepEqual(result, expectedResult, 'Function returned expected result object');
  }

  test.done();
};
