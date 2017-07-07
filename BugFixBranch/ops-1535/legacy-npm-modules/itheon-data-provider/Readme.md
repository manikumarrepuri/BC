Itheon Data Provider [![Build Status](http://10.187.75.160/itheonx/itheon-data-provider/badges/develop/build.svg)](http://10.187.75.160/itheonx/itheon-data-provider/builds)
====================

Itheon Data Provider package provides a collection of data providers used in Itheon software.

## Sample usage ##

#### HTTP Data Provider ####

```js
var config           = require("itheon-config");
var HttpDataProvider = require("itheon-data-provider").HttpDataProvider;
httpDataProvider = new HttpDataProvider(config.get("backend-api"));
```
