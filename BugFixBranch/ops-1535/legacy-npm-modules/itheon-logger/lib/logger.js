
"use strict";

var appRootPath = require("app-root-path");
var winston     = require("winston");
var config      = require("itheon-config").ConfigFactory.getConfig();
var _           = require("itheon-utility").underscore;
var util        = require("util");

class Logger
{
  constructor()
  {
    var transports = [];
    this.levels = { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 };
    this.assignedLevels = [];

    if (config.get("logger:transports:console:enabled")) {
      this.assignedLevels.push(this.levels[config.get("logger:transports:console:level")]);
      transports.push(
        new (winston.transports.Console)(
          config.get("logger:transports:console")
        )
      );
    }

    if (config.get("logger:transports:file:enabled")) {
      this.assignedLevels.push(this.levels[config.get("logger:transports:file:level")]);
      var fileConfig = config.get("logger:transports:file");
      if (fileConfig.filename.charAt(0) !== "/") {
        fileConfig.filename = appRootPath + "/" + fileConfig.filename;
      }
      transports.push(
        new (winston.transports.File)(
          fileConfig
        )
      );
    }

    if (config.get("logger:transports:logentries:enabled")) {
      this.assignedLevels.push(this.levels[config.get("logger:transports:logentries:level")]);
      // var Logentries = require("winston-logentries");
      transports.push(
        new (winston.transports.Logentries)(
          config.get("logger:transports:logentries")
        )
      );
    }
    if (config.get("logger:transports:log2gelf:enabled")) { 
      this.assignedLevels.push(this.levels[config.get("logger:transports:log2gelf:level")]); 
      var WinstonGraylog2 = require('winston-log2gelf');
      transports.push(
        new (winston.transports.Log2gelf)(
          config.get("logger:transports:log2gelf")
        )
      );
    }

    this.maxLevel = _.max(this.assignedLevels);

    this.logger = new winston.Logger({
      transports : transports
    });
  }

  _log(level, message, data)
  {
    var output = "";
    if (this.maxLevel < this.levels[level]) {
      return false;
    }
    if (message && !(message instanceof Error)) {
      output += message;
    }

    else if (message instanceof Error) {
      output += "Message: " + message.message + "\n" +
                 "Stack Track: " + message.stack + "\n";
    }

    if (data) {
      output += "\nAdditional data: " + util.inspect(data, {showHidden: true, depth: 5});
    }

    this.logger.log(level, output);
  }

  log(level, message, data)
  {
    this._log(level, message, data);
  }

  info(message, data)
  {
    this._log("info", message, data);
  }

  debug(message, data)
  {
    this._log("debug", message, data);
  }

  verbose(message, data)
  {
    this._log("verbose", message, data);
  }

  silly(message, data)
  {
    this._log("silly", message, data);
  }

  warn(message, data)
  {
    this._log("warn", message, data);
  }

  error(message, data)
  {
    this._log("error", message, data);
  }
}

module.exports.Logger = Logger;
module.exports.logger = new Logger();
