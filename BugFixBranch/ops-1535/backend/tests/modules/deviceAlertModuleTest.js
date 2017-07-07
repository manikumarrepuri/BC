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
describe('Device Alert Module Unit Tests ->', function () {
  beforeEach(function (done) {
    var conn = mongoose.createConnection();
    done();
  });
  /*
   * Test the /POST route, insert the device.
   */
  describe('/POST a devices alert', function () {
    it('it should update the devices with the given alerts for the given deviceId', (done) => {
      let deviceAlert = {
        id: "AJ BELL:AJBTEST"
      };
      chai.request(server)
        .post('/devices/:deviceId/alerts?"deviceId"')
        .send(deviceAlert)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('ok');
          done();
        });
    });
  });
  describe('/Delete a devices alert', function () {
    it('it should delete the alert from the devices for the given deviceId with given alert', (done) => {
      chai.request(server)
        .delete('/devices/:deviceId/alerts/:alertId?"deviceId"')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
