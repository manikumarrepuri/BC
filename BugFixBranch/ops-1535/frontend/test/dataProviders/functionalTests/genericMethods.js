/*
 * require declarations
 */
var config      = require('../../config');
var webdriver   = require('selenium-webdriver');
var chai        = require('chai');
var should      = chai.should();
var expect      = chai.expect;
var assert      = chai.assert;



/*
 * variable declarations
 */

var elementLoginWait    = 'logins';
var elementDeviceWait   = 'tr';

/*
 * class declaration
 */

function GenericMethods(driver) {
  this.webdriver = webdriver;
  this.driver = driver;

  var LoginMethods        = require('./loginPage/loginMethods');
  var HomeMethods         = require('./homePage/homeMethods');
  var DevicesListMethods  = require('./deviceListPage/devicesListMethods');

  this.webdriverSetup = function() {
    driver = new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.chrome()).build();

    return driver;
  };

  this.classSetup = function() {
    login = new LoginMethods();
    home = new HomeMethods();
    devices = new DevicesListMethods();
  };

  this.navigateToWebsite = function() {
    driver.get(config.appliance.url);
    generic.webdriverWait(elementLoginWait, 100000);
  };

  this.navigateToDevicesPage = function() {
    driver.get(config.appliance.deviceURL);
    generic.webdriverWait(elementDeviceWait, 100000);
  };

  this.webdriverShutdown = function() {
   driver.quit();
  };

  this.webdriverWait = function(element, timeout) {
    driver.wait(function() {
      return driver.isElementPresent(webdriver.By.css(element));
    }, timeout).then(null, function(error) {
      throw new Error('just a test error');
    });
  };
  
  this.explicitWait = function (timeout) {
    return driver.sleep(timeout);
  };

  this.findElement = function(element) {
    return driver.findElement(this.webdriver.By.css(element))
      .then(null, function (error) {
        throw new Error(element + ' element was not found');
    });
  };

  this.enterText = function(element, input) {
    return driver.findElement(this.webdriver.By.css(element))
      .then(function (element) {
        element.sendKeys(input);
    });
  };

  this.clickElement = function(element) {
    return driver.findElement(this.webdriver.By.css(element))
      .then(function (element) {
        element.click();
    });
  };

  this.assertElementValue = function(element, expectedValue) {
    return driver.findElement(webdriver.By.css(element)).getAttribute('innerHTML')
      .then(function (value) {
        expect(value).to.equal(expectedValue);
    });
  };
  
  this.assertElementContains = function(element, expectedValue) {
    return driver.findElement(webdriver.By.css(element)).getAttribute('innerHTML')
      .then(function (value) {
        expect(value).to.contain(expectedValue);
    });
  };

  this.findMultipleElements = function (element) {
    return driver.findElements(webdriver.By.css(element));
  };

  this.returnInnerHTML = function (element) {
    return driver.findElement(webdriver.By.css(element)).getAttribute('innerHTML');
  };

  this.sendTextToElement = function (element, text) {
    return driver.findElement(webdriver.By.css(element)).sendKeys(text);
  };

  this.isElementPresent = function (element) {
    return driver.isElementPresent(webdriver.By.css(element));
  };
  
  this.clearTextInElement = function (element) {
    return driver.findElement(webdriver.By.css(element)).clear();
  };
  

}

module.exports = GenericMethods;