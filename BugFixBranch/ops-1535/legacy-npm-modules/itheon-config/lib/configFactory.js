
"use strict";

var appRootPath = require("app-root-path");
var Config      = require("./config");

class ConfigFactory
{
  static getBasePath()
  {
    if (!Config.basePath) {
      Config.basePath = appRootPath;
    }

    return Config.basePath;
  }

  static setBasePath(basePath)
  {
    Config.basePath = basePath;
  }

  static getConfig()
  {
    if (!ConfigFactory.config) {
      ConfigFactory.config = new Config();
    }

    return ConfigFactory.config;
  }
}

module.exports = ConfigFactory;
