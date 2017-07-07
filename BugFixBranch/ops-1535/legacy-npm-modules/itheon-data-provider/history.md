3.2.1 / 2016-10-17
===================
* Fixed a problem with setting queueOptions this = that

3.2.0 / 2016-10-06
===================
* Added set and get queueOptions functions to the amqpDataProvider
* Updated ioRedis for the redisDataProvider

3.1.4 / 2016-08-26
===================
* Added logging for when a http get request is made from the httpDataProvider

3.1.3 / 2016-06-23
===================
* Added logging for when a request fails to the httpDataProvider

3.1.2 / 2016-06-08
===================
* Amqp fix to lazy connect only when used

3.1.0 / 2016-05-17
===================
* Transition httpDataProvider now expects a request object containing a payload.

3.0.1 / 2016-05-13
===================
* Fixed a problem with the function name setQueues

3.0.0 / 2016-05-13
===================
* Changed AMQP package to a singleton that expects a list of queues

2.1.0 / 2016-05-12
===================
* Adding new method unacknowledge to AMQP package

2.0.8 / 2016-05-05
===================
* Addded support for sentinels

2.0.7 / 2016-05-05
===================
* On redis error fixed

2.0.6 / 2016-04-28
===================
* HttpGateway update to export entity before sending

2.0.5 / 2016-04-28
===================
* Redis data provider will now allow you to use clustering or a single machine

2.0.4 / 2016-04-21
===================
* Missing itheon-entity package dependency added

2.0.3 / 2016-04-18
===================
* Hardcoded rethinkdbdash version to avoid bug

2.0.1 / 2016-03-08
===================
* Missing 'amqplib' dependency added

2.0.0 / 2016-03-07
===================
* Breaking change, it is now required to pass httpConfig if no httpClient exists.
* Added history

1.0.4 / 2016-03-04
===================
* Added some more logging

1.0.3 / 2016-03-04
===================
* Added a new dataprovider.

1.0.2 / 2016-02-25
===================
* Npm publish gone wrong - increased number to fix it - whyyyyy

1.0.1 / 2016-02-25
===================
* Relative path fixed

1.0.0 / 2016-02-18
===================
* Initial release
