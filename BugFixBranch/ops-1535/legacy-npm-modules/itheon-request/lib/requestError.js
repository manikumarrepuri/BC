
"use strict";

var appRootPath = require("app-root-path");
var BaseError   = require("itheon-error").BaseError;

class RequestError extends BaseError
{

}

module.exports = RequestError;
