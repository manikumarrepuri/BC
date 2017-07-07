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
describe('Device Module Unit Tests ->', function () {
  beforeEach(function (done) {
    var conn = mongoose.createConnection();
    done();
  });
  /*
   * Test the /POST route, insert the device.
   */
  describe('/POST a device', function () {
    it('it should create a new device and return the new device as result', (done) => {
      let device = {
        id: "AJ BELL:AJBTEST",
        group: "AJ BELL",
        name: "AJBTEST"
      };
      chai.request(server)
        .post('/devices')
        .send(device)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('group');
          res.body.should.have.property('name');
          done();
        });
    });
    it('it should not create a new device if id is not passed, error.', (done) => {
      let device = {
        group: "AJ BELL",
        name: "AJBTEST"
      };
      chai.request(server)
        .post('/devices')
        .send(device)
        .end((err, res) => {
          err.should.have.status(500);
          done();
        });
    });

  });
  describe('/PATCH a device', function () {
    it('it should update existing device and return the device as result', (done) => {
      let device = {
        id: "AJ BELL:AJBTEST",
        group: "AJ BELL",
        name: "AJBTEST"
      };
      chai.request(server)
        .patch('/devices/:id')
        .send(device)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('group');
          res.body.should.have.property('name');
          done();
        });
    });
    it('it should not update device if id is not passed, error.', (done) => {
      let device = {
        group: "AJ BELL",
        name: "AJBTEST"
      };
      chai.request(server)
        .patch('/devices/:id')
        .send(device)
        .end((err, res) => {
          err.should.have.status(500);
          done();
        });
    });

  });
});
