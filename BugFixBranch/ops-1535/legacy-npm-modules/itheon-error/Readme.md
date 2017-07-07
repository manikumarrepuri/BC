Itheon Error
============

[![Build Status](http://10.187.75.150:9443/buildStatus/icon?job=Build - itheon-error)](http://10.187.75.150:9443/job/Build%20-%20itheon-error/)

Itheon Error is a generic extension of the Error class packed and ready to use by Itheon software.

## Sample usage ##

#### Itheon Error ####

```js
var BaseError = require("itheon-error").BaseError;
class ExtendedError extends BaseError {};
```

#### Error Handler ####

```js
var errorHandler = require("itheon-error").errorHandler;
errorHandler.resolve("error", req, res);
```

or

```js
var errorHandler = require("itheon-error").errorHandler;
var BaseError = require("itheon-error").BaseError;
errorHandler.resolve(new BaseError("error", null, 404), req, res);
```
