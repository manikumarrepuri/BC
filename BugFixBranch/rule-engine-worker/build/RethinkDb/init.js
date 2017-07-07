#!/usr/bin/env node

/**
 * Setup database script can be run against any database that is
 * defined in configuration file as it will be automatically
 * fetched based on NODE_ENV system variable.
 *
 * It can be used in following way:
 * - setting up testing database
 * $ export NODE_ENV=test && build/setupDb.js
 * - setting up development database
 * $ export NODE_ENV=app && build/setupDb.js
 */

"use strict";

var fs      = require("fs");

// getting possible command line args
var scriptsDir = "clean";
if (process.argv[2]) {
  scriptsDir = process.argv[2];
}

const config = require("opserve-common").Config.get();
var rethinkDbConfig = config.get("rethinkdb");
var files           = fs.readdirSync(__dirname + "/" + scriptsDir);
var async           = require("async");

var r = require("rethinkdbdash")(rethinkDbConfig);

console.log("------------------------------------------------");
console.log("|                RethinkDB Build               |");
console.log("------------------------------------------------");

r.dbList().run().then(function (list) {
  if (list.indexOf(rethinkDbConfig.db) > -1) {
    console.log("Dropping database " + rethinkDbConfig.db);
    return r.dbDrop(rethinkDbConfig.db).run();
  }
}).then(function() {
  console.log("Creating empty database " + rethinkDbConfig.db);
  return r.dbCreate(rethinkDbConfig.db).run();
}).then(function() {
  async.mapSeries(
    files,
    function (file, callback) {

      console.log("INFO: Executing file " + scriptsDir + "/" + file);

      require(__dirname + "/" + scriptsDir + "/" + file).then(function (result) {
        return callback(null, "ok");
      });
    },
    function (err) {
      if (err) {
        console.log(err);
        throw new Error("Error ocurred" + err);
      }

      console.log("Build completed!");
      process.exit(0);
    }
  );
});
