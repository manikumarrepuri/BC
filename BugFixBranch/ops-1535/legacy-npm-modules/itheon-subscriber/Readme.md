Itheon Subscriber
============

[![Build Status](http://10.187.75.150:9443/buildStatus/icon?job=Build - itheon-subscriber)](http://10.187.75.150:9443/job/Build%20-%20itheon-subscriber/)

Itheon subscriber is a set of subscriber's for pushing data in different ways.

## Sample usage ##

#### Subscriber Service ####

```js
var SubscriberService = require('itheon-subscriber').SubscriberService;
var AlertEntity       = require('itheon-module-alert-entity').AlertEntity;
var _                 = require('itheon-utility').underscore;
var alertEntity       = new AlertEntity(JSON.parse(request));
var subscriberService = new SubscriberService(alertEntity);
_.each(alertEntity.get('subscribers'), function(subscriber, index){
  subscriberService.handleSubscribers(subscriber);
});
```
