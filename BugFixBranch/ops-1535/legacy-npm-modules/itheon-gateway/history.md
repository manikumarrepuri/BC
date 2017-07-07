3.2.22 / 2016-11-08
===================
* RethinkdbGateway moved the check for regex to the top of the query builder since for some reason on Staging tag search became a contains search.

3.2.21 / 2016-11-08
===================
* RethinkDbChangefeedGateway now attempts to reconnect failed changefeeds

3.2.20 / 2016-11-08
===================
* Validating an insert for rethinkDB was not reliably determining an entity I've altered the code from instanceOf to ducktyping.

3.2.19 / 2016-11-08
===================
* It seems the HTTP gateway can also return a collectionEntity

3.2.18 / 2016-11-08
===================
* RethinkDBGateway causes issues, due to using new itheon-entity function that might not exist on all entities

3.2.17 / 2016-11-08
===================
* It seems the HTTP gateway is returning an object with headers and body not sure when this changed but it's messing up the save method.
* RethinkDBGateway now uses indexes based on the entity.

3.2.16 / 2016-10-05
===================
* Added amqpGateway unit tests.

3.2.15 / 2016-10-05
===================
* Added cacheGateway unit tests.
* Added baseGateway unit tests.

3.2.14 / 2016-10-04
===================
* Added redisGateway unit tests.

3.2.13 / 2016-09-28
===================
* Altered the way group() works within the rethinkDbGateway now it unwrap's the group if it has been reduced so the sort will work and returns a flattened array.

3.2.12 / 2016-09-21
===================
* Sadly instanceOf is unreliable with sub-packages so changed checks to isObject

3.2.11 / 2016-08-23
===================
* Added additional logging

3.2.10 / 2016-07-22
===================
* Changefeed gateway now includes returning of types

3.2.9 / 2016-07-21
===================
* Created a new changefeed gateway to allow for subscribing and unsubscribing from changefeeds

3.2.8 / 2016-07-12
===================
* Redis gateway hget method now attempts to parse JSON.

3.2.7 / 2016-07-11
===================
* Added hget method for Redis gateway.

3.2.6 / 2016-06-20
===================
* Unbodging fix to return only id

3.2.5 / 2016-06-15
===================
* Fixed an issue where there createdAt was not added if missing when not using entities

3.2.4 / 2016-06-14
===================
* Consistency fix - query function will now always return array of results

3.2.3 / 2016-06-13
===================
* Fixed a bug introduced by the previous change.

3.2.2 / 2016-06-13
===================
* Re-added option to insert multiple items to rethinkDbGateway

3.2.1 / 2016-06-09
===================
* Only one parameter is now required for amqpDataProvider subscribe

3.2.0 / 2016-06-06
===================
* Support for left outer join added to rethinkDbGateway

3.1.0 / 2016-05-18
===================
* Transition httpGateway now expects a request object containing a payload if entity is passed a "Depreciated" warning will be sent.

3.0.1 / 2016-05-13
===================
* Fixed a problem with the wrong function name setQueues

3.0.0 / 2016-05-13
===================
* AmqpGateway is now a singleton that requests a list of queues

2.6.0 / 2016-05-12
===================
* Added unacknowledge to the AmqpGateway

2.5.2 / 2016-05-12
===================
* updating to OLD data provider version

2.5.1 / 2016-05-10
===================
* fix to rethinkdb id retrieval

2.5.0 / 2016-05-10
===================
* updating data provider version

2.4.0 / 2016-05-10
===================
* using new dataprovider version

2.3.0 / 2016-04-26
===================
* Added a new options to max, min, avg and sum records
* Added ungroup which will occur after the above functions is group was used.

2.2.0 / 2016-04-26
===================
* Added a new option to group records

2.1.5 / 2016-04-25
===================
* Error logging upgraded

2.1.4 / 2016-04-18
===================
* Added a new option to return distinct records

2.1.3 / 2016-04-08
===================
* amqp gateway was using the wrong require statement for underscore.

2.1.2 / 2016-04-01
===================
* amqp methods added like subscribe etc.

2.1.1 / 2016-03-15
===================
* data provider dependency update

2.1.0 / 2016-03-11
===================
* memory gateway added

2.0.1 / 2016-03-11
===================
* hmset() and hgetall() added to redis gateway

2.0.0 / 2016-03-07
===================
* Breaking change, it is now required to pass httpConfig if no httpDataProvider has been passed.
* Added history

1.0.4 / 2016-03-04
===================

* Added in missing logger
* Added a setURL method
* Added in a dependency.
* Added amqp gateway, added itheon-data-provider as a dependancy and altered what get's exported.

1.0.3 / 2016-03-01
===================
* Removed redundant logic

1.0.2 / 2016-02-25
===================
* Updated rethinkdb to use schema inspector and regex
* Updated rethinkdb to fix appendJoins

1.0.1 / 2016-02-23
===================
* Export GatewayError

1.0.0 / 2016-02-19
===================
* Initial release
