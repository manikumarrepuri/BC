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
describe('Alert Module Unit Tests ->', function () {
  beforeEach(function (done) {
    var conn = mongoose.createConnection();
    done();
  });
  /*
   * Test the /POST route, insert the device.
   */
  describe('/POST an alert', function () {
    it('it should create a new alert and return the new alert as result', (done) => {
      let alert = {
        deviceId: "AJ BELL:AJBTEST",
        ruleName: "Itheon 7",
        group: "AJ BELL",
        name: "AJBTEST"
      };
      chai.request(server)
        .post('/alerts')
        .send(alert)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('deviceId');
          res.body.should.have.property('ruleName');
          done();
        });
    });
    it('it should not create a new alert if deviceId is not passed, error.', (done) => {
      let alert = {
        ruleName: "Itheon 7",
        group: "AJ BELL",
        name: "AJBTEST"
      };
      chai.request(server)
        .post('/alerts')
        .send(alert)
        .end((err, res) => {
          err.should.have.status(500);
          done();
        });
    });

  });
  describe('/PATCH an alert', function () {
    it('it should update existing alert and return the alert as result', (done) => {
      let alert = {
        _id: "abcd123fg",
        ruleName: "Itheon 7",
        group: "AJ BELL",
        name: "AJBTEST"
      };
      chai.request(server)
        .patch('/alerts/:id')
        .send(alert)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('ruleName');
          done();
        });
    });
    it('it should not update alert if _id is not passed, error.', (done) => {
      let alert = {
        ruleName: "Itheon 7",
        group: "AJ BELL",
        name: "AJBTEST"
      };
      chai.request(server)
        .patch('/alerts/:id')
        .send(alert)
        .end((err, res) => {
          err.should.have.status(500);
          done();
        });
    });
  });
  describe('/Find an alert', function () {
    it('it should return the alerts as a result, conditions sent through body', (done) => {
      chai.request(server)
        .get('/alerts')
        .send({
          state: {
            $ne: 'O'
          }
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.alerts[0].should.have.property('_id');
          res.body.alerts[0].should.have.property('ruleName');
          res.body.alerts[0].should.have.property('state');
          done();
        });
    });
    it('it should return the alerts, conditions sent through query', (done) => {
      chai.request(server)
        .get('/alerts')
        .query({
          conditions: {
            status: "1"
          }
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.alerts[0].should.have.property('_id');
          res.body.alerts[0].should.have.property('ruleName');
          res.body.alerts[0].should.have.property('state');
          done();
        });
    });
  });
});
