/*
 * require declarations
 */
var GenericMethods    = require('../dataProviders/functionalTests/genericMethods');
var HomeMethods       = require('../dataProviders/functionalTests/homePage/homeMethods');
var LoginMethods      = require('../dataProviders/functionalTests/loginPage/loginMethods');

var webdriver         = require('selenium-webdriver');
var test              = require('selenium-webdriver/testing');

/*
 * tests
 */

test.describe('devices list page tests', function() {
  this.timeout(120000);
  test.before('setup', function(done) {
    generic = new GenericMethods();
    generic.classSetup();
    driver = generic.webdriverSetup();
    devices.flushRedisCluster();
    // create/update Reddis data if required
    devices.createReddisData();
    devices.loginAndOpenDevicesList();
    done();
  });

  test.after('shutdown', function() {
    generic.webdriverShutdown();
  });

  test.describe('successful operation checks', function() {
    test.it('count of devices should match what is displayed', function(done) {
      devices.checkCorrectNumberOfDevicesIsDisplayed();
      done();
    });

    test.it('should return correct devices using search box', function(done) {
      devices.checkCorrectSearchResultsAreDisplayed();
      done();
    });
    
    test.it('should return correct platform icon', function (done) {
      devices.confirmCorrectPlatform();
      done();
    });
    
    test.it('check correct CPU metrics are displayed', function (done) {
      devices.confirmCorrectCPU();
      done();
    });
    
    test.it('check correct RAM metrics are displayed', function(done) {
      devices.confirmCorrectRAM();
      done();
    });
  });

  test.describe('unsuccessful operation checks', function() {
    test.it('should return nothing when searching for a non-existing server', function(done) {
      devices.checkNoSearchResultsAreDisplayed();
      done();
    });
  });

});
