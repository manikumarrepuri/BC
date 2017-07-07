/*
 * require declarations
 */
var config          = require('../../../config');
var GenericMethods  = require('../genericMethods');
var devices         = require('./devices');

var chai      = require('chai');
var should    = chai.should();
var expect    = chai.expect;
var assert    = chai.assert;
var Redis     = require('ioredis');
var cluster     = new Redis.Cluster([
  {
    port: config.redis.masterOne.port,
    host: config.redis.masterOne.host
  }, {
    port: config.redis.masterTwo.port,
    host: config.redis.masterTwo.host
  }, {
    port: config.redis.masterThree.port,
    host: config.redis.masterThree.host
  }
]);

/*
 * variable declarations
 */

var webdriver         = require('selenium-webdriver');

// ===================== Elements ==============================================

var elementDeviceSelector     = 'tr:not(:first-child)';
var elementDeviceTotal        = 'h3.box-title';
var elementDeviceTotalSplit   = ' <span';
var elementDeviceNames        = 'td:nth-child(2)';
var elementSearch             = '[placeholder="Search"]';
var elementTableDetail        = 'td';
var elementTableRow           = 'tr';

// ===================== Values ================================================

var valueDeviceTotalText      = ' Devices';

function DevicesListMethods(driver) {
  this.webdriver = webdriver;
  generic = new GenericMethods();

  this.loginAndOpenDevicesList = function() {
    generic.navigateToWebsite();
    login.login();
    home.confirmSuccessfulLogin();
    generic.navigateToDevicesPage();
  };

  this.checkCorrectNumberOfDevicesIsDisplayed = function() {
    generic.findMultipleElements(elementDeviceSelector)
      .then(function (devices) {
        generic.returnInnerHTML(elementDeviceTotal)
          .then(function (value) {
            var res = value.split(elementDeviceTotalSplit);
            expect(res[0]).to.contain(devices.length+valueDeviceTotalText);
        });
    });
  };
  
  this.checkCorrectSearchResultsAreDisplayed = function() {
    var searchResult;
    generic.returnInnerHTML(elementDeviceNames)
      .then(function (value) {
        searchResult = value;
        generic.sendTextToElement(elementSearch, searchResult);
    }).then(function () {
      generic.findMultipleElements(elementDeviceNames)
        .then(function (returnedElements){
          for (var x in returnedElements) {
            var element = returnedElements[x];
            var result = false;
            var attempts = 0;
            try {
              while (attempts < 4) {
              element.getAttribute('innerHTML')
                .then(function (value) {
                  expect(value).to.equal(searchResult);
                  result = true;
              });
              break;
              }
            } catch (e) {
              console.log(e);
            }
            attempts++;
            return result;
          };
      });
    // clear text from search box ready for next test  
    }).then(function () {
      generic.clearTextInElement(elementSearch);
    });
  };
  
  this.checkNoSearchResultsAreDisplayed = function() {
    generic.sendTextToElement(elementSearch, "nonExistingServer");
    generic.explicitWait(3000)
      .then(function () {
        generic.isElementPresent(elementDeviceNames)
          .then(function (result) {
          expect(result).to.be.false;
      });
    // clear text from search box ready for next test
    }).then(function () {
      generic.clearTextInElement(elementSearch);
    });
  };
  
  var confirmCorrectValueInTable = function(columnIndex, lookupReference) {
    // find all elements defined
    generic.findMultipleElements(elementTableRow)
      // return an array called tableRows with the returned elements
      .then(function (tableRows) {
        // create a for loop with x being the current index of the array
        for (var x in tableRows) {
          // create a variable to ensure we are working with the current row element
          var currentRow = tableRows[x];
          // when in the current row element, find all elements defined
          currentRow.findElements(webdriver.By.css(elementTableDetail))
            // return an array called tableDetails with the returned elements
            .then(function (tableDetails) {
              // create a for loop with y being the current index of the array
              for (var y in tableDetails) {
                // select variable position for device name and assign to detailValue
                var detailValue = tableDetails[1];
                // get text of device name
                detailValue.getText()
                  // return text value as deviceName
                  .then(function (deviceName) {
                    // select variable position for required field and get the innerHTML
                    tableDetails[columnIndex].getAttribute('innerHTML')
                      // return innerHTML value as returnedColumn
                      .then(function (returnedColumn) {
                        /*
                        * expect returnedColumn to contain the field dependant
                        * on the lookupReference. 
                        */
                        expect(returnedColumn).to.contain(
                          eval(lookupReference));
                    });
                });
                // break out of the loop so it does not do this more that once
                // for each deviceName.
                break;
              };
          });
        };
    });
  };
  
  this.confirmCorrectPlatform = function() {
    confirmCorrectValueInTable(2, 
      'devices.redisInput[deviceName].platform');
  };
  
  this.confirmCorrectCPU = function() {
    // // find all elements defined
    generic.findMultipleElements(elementTableRow)
      // return an array called tableRows with the returned elements
      .then(function (tableRows) {
        // create a for loop with x being the current index of the array
        for (var x in tableRows) {
          // create a variable to ensure we are working with the current row element
          var currentRow = tableRows[x];
          // when in the current row element, find all elements defined
          currentRow.findElements(webdriver.By.css(elementTableDetail))
          // return an array called tableDetails with the returned elements
            .then(function (tableDetails) {
              // create a for loop with y being the current index of the array
              for (var y in tableDetails) {
                // select variable position for device name and assign to detailValue
                var detailValue = tableDetails[1];
                // get text of device name
                detailValue.getText()
                  // return text value as deviceName
                  .then(function (deviceName) {
                    // select variable position for CPU statistic and get Text
                    tableDetails[3].getText()
                      // return text value as deviceCPU
                      .then(function (deviceCPU) {
                        /*
                        * expect deviceCPU to contain the CPU dependant
                        * on the deviceName. Note: deviceName is in square brackets
                        * to indicate it is a variable and not a literal object
                        */
                        expect(deviceCPU).to.contain(
                        devices.redisInput[deviceName].metrics
                        .cpuBusy.value);
                    });
                });
                // break out of the loop so it does not do this more that once
                // for each deviceName.
                break;
              };
          });
        };
    });
  };
  
  this.confirmCorrectRAM = function() {
    // // find all elements defined
    generic.findMultipleElements(elementTableRow)
      // return an array called tableRows with the returned elements
      .then(function (tableRows) {
        // create a for loop with x being the current index of the array
        for (var x in tableRows) {
          // create a variable to ensure we are working with the current row element
          var currentRow = tableRows[x];
          // when in the current row element, find all elements defined
          currentRow.findElements(webdriver.By.css(elementTableDetail))
          // return an array called tableDetails with the returned elements
            .then(function (tableDetails) {
              // create a for loop with y being the current index of the array
              for (var y in tableDetails) {
                // select variable position for device name and assign to detailValue
                var detailValue = tableDetails[1];
                // get text of device name
                detailValue.getText()
                  // return text value as deviceName
                  .then(function (deviceName) {
                    // select variable position for RAM statistic and get Text
                    tableDetails[4].getText()
                      // return text value as deviceRAM
                      .then(function (deviceRAM) {
                        /*
                        * expect deviceRAM to contain the RAM dependant
                        * on the deviceName. Note: deviceName is in square brackets
                        * to indicate it is a variable and not a literal object
                        */
                        expect(deviceRAM).to.contain(
                        devices.redisInput[deviceName].metrics
                        .physicalMemoryUsed.value);
                    });
                });
                // break out of the loop so it does not do this more that once
                // for each deviceName.
                break;
              };
          });
        };
    });
  };
  
//  Method to clear out the data in the Redis cluster
  this.flushRedisCluster = function() {
//    For loop to perform an action on each node on the Redis cluster
    for (var key in cluster.nodes) {
//      assign variable (node) to each index (each node in the Redis cluster)
      var node = cluster.nodes[key];
//      send FLUSH ALL command to each node in the Redis cluster
      node.flushall();
    }
  };
  
  this.createReddisData = function() {
    cluster.set('device:Microsoft:USA:A12BFG',
      JSON.stringify(devices.redisInput.A12BFG));
    cluster.set('device:Microsoft:UK:F57ABV',
      JSON.stringify(devices.redisInput.F57ABV));
    cluster.set('device:Google:Turkey:applicationServer',
      JSON.stringify(devices.redisInput.applicationServer));
    cluster.set('device:Google:Russia:emailServer',
      JSON.stringify(devices.redisInput.emailServer));
    cluster.set('device:Facebook:California:productionLinuxAccounts',
      JSON.stringify(devices.redisInput.productionLinuxAccounts));
    cluster.set('device:Facebook:LA:testingWindowsFinance',
      JSON.stringify(devices.redisInput.testingWindowsFinance));
    cluster.set('device:Sony:South:movieBackup',
      JSON.stringify(devices.redisInput.movieBackup));
    cluster.set('device:Sony:North:phoneIdeas',
      JSON.stringify(devices.redisInput.phoneIdeas));
    cluster.set('device:Apple:Cupertino:innovationPlans',
      JSON.stringify(devices.redisInput.innovationPlans));
    cluster.set('device:Apple:London:competitionReview',
      JSON.stringify(devices.redisInput.competitionReview));
  };

}


module.exports = DevicesListMethods;