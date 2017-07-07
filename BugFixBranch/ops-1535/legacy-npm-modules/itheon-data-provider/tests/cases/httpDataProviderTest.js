
"use strict";

var appRootPath = require("app-root-path");
var assert      = require("chai").assert;
var Request     = require("itheon-request");
var nock        = require("nock");
var BaseEntity  = require("itheon-entity").BaseEntity;

var ConfigFactory = require("itheon-config").ConfigFactory;
ConfigFactory.setBasePath(appRootPath + "/tests");
var config = ConfigFactory.getConfig();
var httpConfig = config.get("http");

var HttpDataProvider = require(appRootPath + "/lib/httpDataProvider");
var httpDataProvider = new HttpDataProvider(httpConfig);

class DummyEntity extends BaseEntity
{
  constructor(data)
  {
    super();
    this.setFields({
      name: {"type": 'string'}
    });

    if (data) {
      this.inflate(data);
    }
  }
}

describe("HttpDataProvider", function() {

  describe("sendGetRequest()", function() {

    it("it allows to query data using request object", function(done) {

      var uri = "/devices";

      var query = {
        conditions: {
          name: "John",
          age: {
            gt: 43
          }
        },
        limit: 30
      };

      nock("http://" + httpConfig.host)
        .get(uri)
        .query(true)
        .reply(200, {
          result: "GET OK"
         });

      httpDataProvider.apiUrl = uri;
      let request = new Request(query);

      httpDataProvider.sendGetRequest(request)
        .then(function(result) {

          assert.deepEqual(
            result.body, // actualData,
            {result: "GET OK"} // expectedData
          );

          done();
        });
    });
  });

  describe("sendPostRequest()", function() {

    it("it allows to send data using request object", function(done) {

      var uri = "/devices";

      var entityData = {
        name: "John",
        age: 43
      };

      var entity = new DummyEntity();
      entity.setAllowAnyField(true);
      entity.inflate(entityData);

      nock("http://" + httpConfig.host)
        .post(/devices/ , entityData)
        .reply(201, {
          result: "POST OK"
         });

      httpDataProvider.apiUrl = uri;
      let request = new Request();
      request.setPayload(entity);

      httpDataProvider.sendPostRequest(request)
        .then(function(result) {

          assert.deepEqual(
            result, // actualData,
            {result: "POST OK"} // expectedData
          );

          done();

        });
    });
  });

  describe("sendPutRequest()", function() {

    it("it allows to send data using request object", function(done) {

      var uri = "/devices";

      var entityData = {
        id: 1234,
        name: "John",
        age: 43
      };

      var entity = new DummyEntity();
      entity.setAllowAnyField(true);
      entity.inflate(entityData);

      nock("http://" + httpConfig.host)
        .put(/devices/ , entityData)
        .reply(201, {
          result: "PUT OK"
         });

      httpDataProvider.apiUrl = uri;
      let request = new Request();
      request.setPayload(entity);

      httpDataProvider.sendPutRequest(request)
        .then(function(result) {

          assert.deepEqual(
            result, // actualData,
            {result: "PUT OK"} // expectedData
          );

          done();

        });
    });

    it("it should urlencode id", function(done) {

      var uri = "/devices";

      var entityData = {
        id: "Test Space",
        name: "John",
        age: 43
      };

      var entity = new DummyEntity();
      entity.setAllowAnyField(true);
      entity.inflate(entityData);

      nock("http://" + httpConfig.host)
        .put(function(uri) {
          return uri.indexOf("/devices/Test%20Space") >= 0;
        }, entityData)
        .reply(201, {
          result: "PUT OK - SPACE CHECK"
         });

      httpDataProvider.apiUrl = uri;
      let request = new Request();
      request.setPayload(entity);

      httpDataProvider.sendPutRequest(request)
        .then(function(result) {

          assert.deepEqual(
            result, // actualData,
            {result: "PUT OK - SPACE CHECK"} // expectedData
          );

          done();

        });
    });

  });

  describe("sendPatchRequest()", function() {

    it("it allows to send data using request object", function(done) {

      var uri = "/devices";

      var entityData = {
        id: 1234,
        name: "John",
        age: 43
      };

      var entity = new DummyEntity();
      entity.setAllowAnyField(true);
      entity.inflate(entityData);

      nock("http://" + httpConfig.host)
        .patch(/devices/ , entityData)
        .reply(201, {
          result: "PATCH OK"
         });

      httpDataProvider.apiUrl = uri;
      let request = new Request();
      request.setPayload(entity);

      httpDataProvider.sendPatchRequest(request)
        .then(function(result) {

          assert.deepEqual(
            result, // actualData,
            {result: "PATCH OK"} // expectedData
          );

          done();

        });
    });

    it("it should urlencode id", function(done) {

      var uri = "/devices";

      var entityData = {
        id: "Test Space",
        name: "John",
        age: 43
      };

      var entity = new DummyEntity();
      entity.setAllowAnyField(true);
      entity.inflate(entityData);

      nock("http://" + httpConfig.host)
        .patch(function(uri) {
          return uri.indexOf("/devices/Test%20Space") >= 0;
        }, entityData)
        .reply(201, {
          result: "PATCH OK - SPACE CHECK"
         });

      httpDataProvider.apiUrl = uri;
      let request = new Request();
      request.setPayload(entity);

      httpDataProvider.sendPatchRequest(request)
        .then(function(result) {

          assert.deepEqual(
            result, // actualData,
            {result: "PATCH OK - SPACE CHECK"} // expectedData
          );

          done();

        });
    });

  });

  describe("sendDeleteRequest()", function() {

    it("it allows to send request using request object", function(done) {

      var uri = "/devices";

      var entityData = {
        id: 1234
      };

      var entity = new DummyEntity();
      entity.setAllowAnyField(true);
      entity.inflate(entityData);

      nock("http://" + httpConfig.host)
        .delete(/devices/)
        .reply(200, {
          result: "DELETE OK"
         });

      httpDataProvider.apiUrl = uri;
      let request = new Request();
      request.setPayload(entity);

      httpDataProvider.sendDeleteRequest(request)
        .then(function(result) {

          assert.deepEqual(
            result, // actualData,
            {result: "DELETE OK"} // expectedData
          );

          done();

        });
    });

    it("it should urlencode id", function(done) {

      var uri = "/devices";

      var entityData = {
        id: "Test Space",
        name: "John",
        age: 43
      };

      var entity = new DummyEntity();
      entity.setAllowAnyField(true);
      entity.inflate(entityData);

      nock("http://" + httpConfig.host)
        .delete(function(uri) {
          return uri.indexOf("/devices/Test%20Space") >= 0;
        })
        .reply(201, {
          result: "DELETE OK - SPACE CHECK"
         });

      httpDataProvider.apiUrl = uri;
      let request = new Request();
      request.setPayload(entity);

      httpDataProvider.sendDeleteRequest(request)
        .then(function(result) {

          assert.deepEqual(
            result, // actualData,
            {result: "DELETE OK - SPACE CHECK"} // expectedData
          );

          done();

        });
    });

  });

});
