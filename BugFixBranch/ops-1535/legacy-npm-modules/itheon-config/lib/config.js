
"use strict";

var appRootPath = require("app-root-path");
var nconf       = require("nconf");
var fs          = require("fs");

class Config
{
  constructor()
  {
    var environment = this.getEnvironment();

    if (!fs.existsSync(this.getBasePath() + "/config/" + environment + ".json")) {
      throw new Error(
        "Unable to find configuration file for specified environment( " + environment + " )"
      );
    }

    nconf.add("env-file", {type: "file", file: this.getBasePath() + "/config/" + environment + ".env.json"});
    nconf.add("default-file", {type: "file", file: this.getBasePath() + "/config/" + environment + ".json"});
  }

  getBasePath()
  {
    if (!Config.basePath) {
      Config.basePath = appRootPath;
    }

    return Config.basePath;
  }

  setBasePath(basePath)
  {
    Config.basePath = basePath;
  }

  getEnvironment()
  {
    nconf.argv().env("_");
    return nconf.get("NODE:ENV") || "app";
  }

  get(key)
  {
    return nconf.get(key);
  }
}

module.exports = Config;
