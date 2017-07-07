
"use strict"

var appRootPath = require('app-root-path');
var common      = require('opserve-common');
var _           = common.utilities.underscore;

var handlers = require(appRootPath + '/lib/module/handler/config/handlers');
var Event = require(appRootPath + '/lib/module/handler/entity/event');

module.exports.validData = function () {
  var data = [];
  var EventObject = new Event({
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "cpu_load",
    entity: "",
    brief: "some brief",
    fullText: "some full text",
    occurrences:  1,
    firstOccurrence: "1435536065",
    lastOccurrence: "1435536065",
    severity: 4,
    state: "N"
  });

  _.each(handlers,function(handler) {
    data.push([EventObject,handler]);
  });

  EventObject = new Event({
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "cpu_load",
    entity: "",
    brief: "some brief",
    fullText: "some full text",
    occurrences:  2,
    firstOccurrence: "1435536065",
    lastOccurrence: "1435536065",
    severity: 4,
    state: "U"
  });

  _.each(handlers,function(handler) {
    data.push([EventObject,handler]);
  });

  EventObject = new Event({
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "cpu_load",
    entity: "",
    brief: "some brief",
    fullText: "some full text",
    occurrences:  2,
    firstOccurrence: "1435536065",
    lastOccurrence: "1435536065",
    severity: 4,
    state: "C"
  });

  _.each(handlers,function(handler) {
    data.push([EventObject,handler]);
  });

  EventObject = new Event({
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "disk_free",
    entity: "disks.c",
    brief: "some brief",
    fullText: "some full text",
    occurrences:  1,
    firstOccurrence: "1435536065",
    lastOccurrence: "1435536065",
    severity: 1,
    state: "N"
  });

  _.each(handlers,function(handler) {
    data.push([EventObject,handler]);
  });

  EventObject = new Event({
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "disk_free",
    entity: "disks.c",
    brief: "some brief",
    fullText: "some full text",
    occurrences:  2,
    firstOccurrence: "1435536065",
    lastOccurrence: "1435536065",
    severity: 1,
    state: "U"
  });

  _.each(handlers,function(handler) {
    data.push([EventObject,handler]);
  });

  EventObject = new Event({
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "disk_free",
    entity: "disks.c",
    brief: "some brief",
    fullText: "some full text",
    occurrences:  2,
    firstOccurrence: "1435536065",
    lastOccurrence: "1435536065",
    severity: 1,
    state: "C"
  });

  _.each(handlers,function(handler) {
    data.push([EventObject,handler]);
  });

  return data;
}

module.exports.invalidData = function () {
  var data = [];
  var EventObject = new Event({
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "cpu_load"
  });

  _.each(handlers,function(handler) {
    data.push([EventObject,handler]);
  });

  EventObject = {
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "cpu_load",
    entity: "",
    brief: "some brief",
    fullText: "some full text",
    occurrences:  2,
    firstOccurrence: "1435536065",
    lastOccurrence: "1435536065",
    severity: 4,
    state: "U"
  };

  _.each(handlers,function(handler) {
    data.push([EventObject,handler]);
  });

  return data;
}


module.exports.validEventObjectData = function () {
  var data = [];
  var EventObject = new Event({
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "cpu_load",
    entity: "",
    brief: "some brief",
    fullText: "some full text",
    occurrences:  1,
    firstOccurrence: "1435536065",
    lastOccurrence: "1435536065",
    severity: 4,
    state: "N"
  });

  var ResultObject = {
    type: '7',
    valid: 1,
    host: 'Server1',
    date: '29-Jun-2015',
    time: '01:01:05',
    state: 'N',
    class: '',
    subClass: '',
    severity: 4,
    handle: 0,
    handleName: 'cpu_load',
    context: 'cpu_load|Bluechip:Itheon:Bedford:Franklin_Court:Server1',
    creationDate: '29-Jun-2015',
    creationTime: '01:01:05',
    closeDate: '',
    closeTime: '',
    updateCount: 1,
    owner: 'ItheonX',
    brief: 'some brief',
    fullText: 'some full text'
  };

  _.each(handlers,function(handler) {
    data.push([EventObject,handler,ResultObject]);
  });

  EventObject = new Event({
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "cpu_load",
    entity: "",
    brief: "some brief",
    fullText: "some full text",
    occurrences:  2,
    firstOccurrence: "1435536065",
    lastOccurrence: "1435536065",
    severity: 4,
    state: "U"
  });

  var ResultObject = {
    type: '7',
    valid: 1,
    host: 'Server1',
    date: '29-Jun-2015',
    time: '01:01:05',
    state: 'U',
    class: '',
    subClass: '',
    severity: 4,
    handle: 0,
    handleName: 'cpu_load',
    context: 'cpu_load|Bluechip:Itheon:Bedford:Franklin_Court:Server1',
    creationDate: '29-Jun-2015',
    creationTime: '01:01:05',
    closeDate: '',
    closeTime: '',
    updateCount: 2,
    owner: 'ItheonX',
    brief: 'some brief',
    fullText: 'some full text'
  };

  _.each(handlers,function(handler) {
    data.push([EventObject,handler,ResultObject]);
  });

  EventObject = new Event({
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "cpu_load",
    entity: "",
    brief: "some brief",
    fullText: "some full text",
    occurrences:  2,
    firstOccurrence: "1435536065",
    lastOccurrence: "1435536065",
    severity: 4,
    state: "C"
  });

  var ResultObject = {
    type: '7',
    valid: 1,
    host: 'Server1',
    date: '29-Jun-2015',
    time: '01:01:05',
    state: 'C',
    class: '',
    subClass: '',
    severity: 4,
    handle: 0,
    handleName: 'cpu_load',
    context: 'cpu_load|Bluechip:Itheon:Bedford:Franklin_Court:Server1',
    creationDate: '29-Jun-2015',
    creationTime: '01:01:05',
    closeDate: '29-Jun-2015',
    closeTime: '01:01:05',
    updateCount: 2,
    owner: 'ItheonX',
    brief: 'some brief',
    fullText: 'some full text'
  };

  _.each(handlers,function(handler) {
    data.push([EventObject,handler,ResultObject]);
  });

  EventObject = new Event({
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "disk_free",
    entity: "disks.c",
    brief: "some brief",
    fullText: "some full text",
    occurrences:  1,
    firstOccurrence: "1435536065",
    lastOccurrence: "1435536065",
    severity: 1,
    state: "N"
  });

  ResultObject = {
    type: '7',
    valid: 1,
    host: 'Server1',
    date: '29-Jun-2015',
    time: '01:01:05',
    state: 'N',
    class: '',
    subClass: '',
    severity: 1,
    handle: 0,
    handleName: 'disk_free',
    context: 'disk_free|Bluechip:Itheon:Bedford:Franklin_Court:Server1|disks.c',
    creationDate: '29-Jun-2015',
    creationTime: '01:01:05',
    closeDate: '',
    closeTime: '',
    updateCount: 1,
    owner: 'ItheonX',
    brief: 'some brief',
    fullText: 'some full text'
  };

  _.each(handlers,function(handler) {
    data.push([EventObject,handler,ResultObject]);
  });

  EventObject = new Event({
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "disk_free",
    entity: "disks.c",
    brief: "some brief",
    fullText: "some full text",
    occurrences:  2,
    firstOccurrence: "1435536065",
    lastOccurrence: "1435536065",
    severity: 1,
    state: "U"
  });

  ResultObject = {
    type: '7',
    valid: 1,
    host: 'Server1',
    date: '29-Jun-2015',
    time: '01:01:05',
    state: 'U',
    class: '',
    subClass: '',
    severity: 1,
    handle: 0,
    handleName: 'disk_free',
    context: 'disk_free|Bluechip:Itheon:Bedford:Franklin_Court:Server1|disks.c',
    creationDate: '29-Jun-2015',
    creationTime: '01:01:05',
    closeDate: '',
    closeTime: '',
    updateCount: 2,
    owner: 'ItheonX',
    brief: 'some brief',
    fullText: 'some full text'
  };

  _.each(handlers,function(handler) {
    data.push([EventObject,handler,ResultObject]);
  });

  EventObject = new Event({
    name: "Server1",
    location : "Bluechip:Itheon:Bedford:Franklin_Court",
    ruleName: "disk_free",
    entity: "disks.c",
    brief: "some brief",
    fullText: "some full text",
    occurrences:  2,
    firstOccurrence: "1435536065",
    lastOccurrence: "1435536065",
    severity: 1,
    state: "C"
  });

  ResultObject = {
    type: '7',
    valid: 1,
    host: 'Server1',
    date: '29-Jun-2015',
    time: '01:01:05',
    state: 'C',
    class: '',
    subClass: '',
    severity: 1,
    handle: 0,
    handleName: 'disk_free',
    context: 'disk_free|Bluechip:Itheon:Bedford:Franklin_Court:Server1|disks.c',
    creationDate: '29-Jun-2015',
    creationTime: '01:01:05',
    closeDate: '29-Jun-2015',
    closeTime: '01:01:05',
    updateCount: 2,
    owner: 'ItheonX',
    brief: 'some brief',
    fullText: 'some full text'
  };

  _.each(handlers,function(handler) {
    data.push([EventObject,handler,ResultObject]);
  });

  return data;
}
