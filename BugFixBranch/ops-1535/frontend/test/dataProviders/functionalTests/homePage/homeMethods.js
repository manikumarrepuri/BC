/*
 * require declarations
 */
var config          = require('../../../config');
var GenericMethods  = require('../genericMethods');

/*
 * variable declarations
 */

var webdriver         = require('selenium-webdriver');

// ===================== Elements ==============================================
var elementHomeHeader   = 'h1';
var elementDevicesList  = '[href="/devices"]';
var elementSidebarMenu  = '.sidebar-menu';

// ===================== Values ================================================

var valueHomeHeader   = 'Device List';

function HomeMethods(driver) {
  this.webdriver = webdriver;
  generic = new GenericMethods();

  this.confirmSuccessfulLogin = function() {
    generic.webdriverWait(elementHomeHeader, 100000);
    generic.assertElementContains(elementHomeHeader, valueHomeHeader);
  };

  this.navigateToDeviceList = function() {
    generic.clickElement(elementDevicesList);
  };


}

module.exports = HomeMethods;