/*
 * require declarations
 */
var GenericMethods    = require('../dataProviders/functionalTests/genericMethods');


var webdriver         = require('selenium-webdriver');
var test              = require('selenium-webdriver/testing');

/*
 * tests
 */

test.describe('login page tests', function() {
  this.timeout(120000);
  test.before('setup', function(done) {
    generic = new GenericMethods();
    generic.classSetup();
    driver = generic.webdriverSetup();
    generic.navigateToWebsite();
    done();
  });

  test.after('shutdown', function() {
    generic.webdriverShutdown();
  });
  
  test.describe('unsuccessful operation checks', function() {
    test.it('should error when entering wrong login credentials', function(done) {
      login.incorrectLogin();
      login.confirmUnsuccessfulLogin();
      done();
    });
  });

  test.describe('successful operation checks', function() {
    test.it('should find username, password and submit elements', function(done) {
      login.findElements();
      done();
    });

    test.it('should successfully login to appliance', function(done) {
      login.login();
      home.confirmSuccessfulLogin();
      done();
    });
  });
  
  

});