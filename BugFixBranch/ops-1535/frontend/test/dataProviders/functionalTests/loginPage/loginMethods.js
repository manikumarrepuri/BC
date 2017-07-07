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
var elementUsername     = '[name=username]';
var elementPassword     = '[name=password]';
var elementSubmit       = '[type=submit]';
var elementPanelHeader  = '.panel-heading h3';

// ===================== Values ================================================

var valueUsername       = "admin";
var valuePassword       = "admin1234";
var valuePanelHeader    = 'Please sign in';


function LoginMethods(driver) {
  this.webdriver = webdriver;
  generic = new GenericMethods();

  this.findElements = function() {
    generic.findElement(elementUsername);
    generic.findElement(elementPassword);   
    generic.findElement(elementSubmit);
  };

  this.login = function() {
    generic.clearTextInElement(elementUsername);
    generic.clearTextInElement(elementPassword);
    generic.enterText(elementUsername, valueUsername);
    generic.enterText(elementPassword, valuePassword);
    generic.clickElement(elementSubmit);
  };

  this.incorrectLogin = function() {
    generic.enterText(elementUsername, "incorrectUsername");
    generic.enterText(elementPassword, "incorrectPassword");
    generic.clickElement(elementSubmit);
  };

  this.confirmUnsuccessfulLogin = function() {
    generic.findElement('.error-message');
  };

}

module.exports = LoginMethods;