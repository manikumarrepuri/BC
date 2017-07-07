
"use strict";

var appRootPath = require("app-root-path");
var _           = require("itheon-utility").underscore;
var fs = require("fs");
var path = require("path");
var TestError   = require("./testError");

class TestHelper
{
  constructor(testDir)
  {
    this.gateway = null;
    this.testPath = null;
    this.testFixturesDirPath = null;
    this.testDataProvidersDirPath = null;

    this.setTestPath(testDir);
  }

  /**
   * Setter for gateway instance
   *
   * @param object gateway Mapper's gateway(i.e. dbConnection)
   * @return self this Fluent interface
   */
  setGateway(gateway)
  {
    this.gateway = gateway;
    return this;
  }

  /**
   * Getter for gateway instance
   *
   * @return object gateway Mapper's gateway(i.e. dbConnection)
   */
  getGateway(gateway)
  {
    return this.gateway;
  }

  setTestPath(testPath)
  {
    try {
      if (!_.isString(testPath) || !fs.realpathSync(testPath)) {
          // lovely interface of fs package...
      }
    } catch (error) {
      throw new TestError("Invalid test path provided");
    }

    this.testPath = testPath;
    return this;
  }

  getTestPath()
  {
    return this.testPath;
  }

  /**
   * Sets path to test's fixtures directory
   *
   * @param String testFixturesDirPath Path to test's fixtures directory
   * @return Helper this Fluent interface
   */
  setTestFixturesDirPath(testFixturesDirPath)
  {
    try {
      if (!_.isString(testFixturesDirPath) || !fs.realpathSync(testFixturesDirPath)) {
        // lovely interface of fs package...
      }
    } catch (error) {
      throw new TestError("Invalid test\"s fixtures path provided");
    }

    this.testFixturesDirPath = testFixturesDirPath;
    return this;
  }

  /**
   * Returns path to test's fixtures directory
   *
   * @return String testFixturesDirPath Path to test's fixtures directory
   */
  getTestFixturesDirPath()
  {
    if (!_.isString(this.testFixturesDirPath)) {
      var testPath = this.getTestPath();

      // deleting ".js"
      var tempDataProviderDir = testPath.substr(0, testPath.length-3);

      // getting base by everything up to "/tests/"
      var testDirPath = tempDataProviderDir.substr(0, tempDataProviderDir.indexOf(path.sep + "tests" + path.sep));
      
      // relPath is everything after "/tests/"
      var relPath = tempDataProviderDir.substr(testDirPath.length + 6);


      // delete /cases/ if exists
      if (relPath.indexOf("cases") > -1) {
        relPath = relPath.substr(6);
      }

      var testFixturesDirPath = path.join(testDirPath, "tests", "fixtures", relPath);

      // adding fixture and testing does it exists
      if (!fs.realpathSync(testFixturesDirPath)) {
        return null;
      }

      if (!testFixturesDirPath.endsWith(path.sep)) {
        testFixturesDirPath += path.sep;
      }

      this.testFixturesDirPath = testFixturesDirPath;
    }

    return this.testFixturesDirPath;
  }

  /**
   * Sets path to test's data provider directory
   *
   * @param String testDataProvidersDirPath Path to test's data provider directory
   * @return Helper this Fluent interface
   */
  setTestDataProvidersDirPath(testDataProvidersDirPath)
  {
    try {
      if (!_.isString(testDataProvidersDirPath) || !fs.realpathSync(testDataProvidersDirPath)) {
        // lovely interface of fs package...
      }
    } catch (error) {
      throw new TestError("Invalid test\"s data provider directory path provided");
    }

    this.testDataProvidersDirPath = testDataProvidersDirPath;
    return this;
  }

  /**
   * Returns path to test's data provider directory
   *
   * @return String testDataProvidersDirPath Path to test's data provider directory
   */
  getTestDataProvidersDirPath()
  {
    if (!_.isString(this.testDataProvidersDirPath)) {
      var testPath = this.getTestPath();

      // deleting ".js"
      var tempDataProviderDir = testPath.substr(0, testPath.length-3);

      // getting base by everything up to "/tests/"
      var testDirPath = tempDataProviderDir.substr(0, tempDataProviderDir.indexOf(path.sep + "tests" + path.sep));
      
      // relPath is everything after "/tests/"
      var relPath = tempDataProviderDir.substr(testDirPath.length + 6);


      // delete /cases/ if exists
      if (relPath.indexOf("cases") > -1) {
        relPath = relPath.substr(6);
      }

      var testDataProvidersDirPath = path.join(testDirPath, "tests", "dataProviders", relPath);

      // adding fixture and testing does it exists
      if (!fs.realpathSync(testDataProvidersDirPath)) {
        return null;
      }

      if (!testDataProvidersDirPath.endsWith(path.sep)) {
        testDataProvidersDirPath += path.sep;
      }

      this.testDataProvidersDirPath = testDataProvidersDirPath;
    }

    return this.testDataProvidersDirPath;
  }

  /**
   * Executes fixture script
   *
   * @param String   fileName Filename of SQL script (without .sql)
   * @param Function callback Done callback
   * @return Helper this Fluent interface
   */
  executeFixtureScript(fileName, callback)
  {
    var promise = require(this.getTestFixturesDirPath() + fileName);

    // running execute in sync-way
    promise().then(function () {
      callback();
    });
  }

  /**
   * Returns required data provider's data
   *
   * @param  String fileName Filename of data provider (without .js)
   * @return Helper this Fluent interface
   */
  getDataProvider(fileName)
  {
      return require(this.getTestDataProvidersDirPath() + fileName + ".js");
  }
}

module.exports = TestHelper;
