process.env.NODE_ENV = 'test';
const appRootPath = require("app-root-path");
var chai = require('chai');
var expect = chai.expect();
var assert = chai.assert;
var should = chai.should();
var chaiHttp = require('chai-http');
var sinon = require('sinon');
require('sinon-mongoose');
//Mocking mongoose
var mongoose = require(appRootPath + "/tests/modules/db/mongoMock");
var server = require(appRootPath + "/app.js");
chai.use(chaiHttp);
describe('Alert History Module Unit Tests ->', function () {
  beforeEach(function (done) {
    var conn = mongoose.createConnection();
    done();
  });
  /*
   * Test the /POST route, insert the device.
   */
  describe('/POST an alert history', function () {
    it('it should create a new alert history and return the new alert history as result', (done) => {
      let alertHistory = {
        deviceId: "AJ BELL:AJBTEST",
        ruleName: "Itheon 7",
        group: "AJ BELL",
        name: "AJBTEST",
        assignee: "admin",
        firstOccurrence: "1481198043048",
        lastOccurrence: "1481198043048"
      };
      chai.request(server)
        .post('/alert-histories')
        .send(alertHistory)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.alertsHistory[0].should.have.property('deviceId');
          res.body.alertsHistory[0].should.have.property('ruleName');
          done();
        });
    });
    it('it should not create a new alert history if deviceId is not passed, error.', (done) => {
      let alertHistory = {
        ruleName: "Itheon 7",
        group: "AJ BELL",
        name: "AJBTEST"
      };
      chai.request(server)
        .post('/alert-histories')
        .send(alertHistory)
        .end((err, res) => {
          err.should.have.status(500);
          done();
        });
    });

  });
  describe('/Find an alert history', function () {
    it('it should return the alert histiry as a result, conditions sent through body', (done) => {
      chai.request(server)
        .get('/alert-histories')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.alertHistory[0].should.have.property('_id');
          res.body.alertHistory[0].should.have.property('ruleName');
          res.body.alertHistory[0].should.have.property('state');
          done();
        });
    });
    it('it should return the alert history, conditions sent through query', (done) => {
      chai.request(server)
        .get('/alert-histories')
        .query({
          conditions: {
            status: "1"
          }
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.alertHistory[0].should.have.property('_id');
          res.body.alertHistory[0].should.have.property('ruleName');
          res.body.alertHistory[0].should.have.property('state');
          done();
        });
    });
  });
});
