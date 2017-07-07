Itheon Gateway
==============

Itheon Gateway provides different gateways used in the Itheon software.

## Sample usage ##

#### HTTP Gateway ####

```js
var config      = require("itheon-config");
var httpGateway = new HttpGateway(null, config.get("frontendApi"));
```

OR

```js
var httpGateway = new HttpGateway(null, {
  "host": "10.187.76.104",
  "protocol": "http://",
  "port": "3002",
  "headers": {
    "content-type": "application/json"
  }
);
```