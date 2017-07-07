process.env.NODE_ENV = 'test';
const appRootPath  = require("app-root-path");
var chai = require('chai');
var expect = chai.expect();
var assert  = chai.assert;
var should  = chai.should();
var chaiHttp = require('chai-http');
var sinon = require('sinon');
require('sinon-mongoose');
//Mocking mongoose
var mongoose = require(appRootPath + "/tests/modules/db/mongoMock");
var server = require(appRootPath + "/app.js"); 
chai.use(chaiHttp);
describe('Filter Module Unit Tests ->', function () {
    beforeEach(function(done) {
        var conn = mongoose.createConnection();
        done();
    });
    describe('/GET all the filter(s)', function () {
        it('it should return all the saved filter(s) as a result', (done) => {
        chai.request(server)
            .get('/filters')
            .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.filters[0].should.have.property('_id');
            done();
            });
        });
    });  
  /*
  * Test the /POST route, insert the device.
  */
  describe('/POST a filter', function () {
      it('it should save filter and return the new filter as result', (done) => {
        let filter = {uiElement: "Alerts",userName: "admin", filterCondition:{group:"AJ BELL",name: "AJBTEST"}};
        chai.request(server)
            .post('/filters')
            .send(filter)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('filterCondition');
                done();
            });
      });
  });
});