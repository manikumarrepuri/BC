
1.4.3 / 2016-11-29
==================

* Updated baseEntity > addProperty() so that it has two parameters the second is the type and is defaulted to "any"

1.4.2 / 2016-11-21
==================

* itheon-utility dasherize no longer returns the leading - since this was an error in dasherize().

1.4.1 / 2016-11-02
==================

* Added methods to check for the presence of an 'indexes' property, and where there is one, return a configured index for a given property.
  * hasDbIndex()
  * getDbIndex()
* Added unit tests to support new methods.

1.3.1 / 2016-09-28
===================

* Updated baseCollectionEntity > updateEntity() to allow for any field to be set (based on collection settings).

1.3.0 / 2016-07-01
===================

* allow to pass collectionEntityClass to be used by baseCollectionEntity


1.2.9 / 2016-06-08
===================

* change in logging level when sanitizing data

1.2.8 / 2016-04-29
===================

* DeleteEntity method now reduces the totalCount.

1.2.7 / 2016-04-29
===================

* Bug fixed in DeleteEntity method.

1.2.6 / 2016-04-29
===================

* DeleteEntity  method added.

1.2.5 / 2016-04-29
===================

* Fixed an issue with dasherize in the BaseCollectionEntity where a - would be added to all entity package names

1.2.4 / 2016-04-29
===================

* Added dasherize to the BaseCollectionEntity and removed some unnecessary checks

1.2.3 / 2016-04-18
===================
* Made a change to allow collection entities that don't currently have an id.

1.2.2 / 2016-03-22
===================
* tidy up

1.2.1 / 2016-03-21
===================
* inflate returns this - fluent interface

1.2.0 / 2016-03-21
===================
* Allow non strict collection of entities

1.1.1 / 2016-03-18
===================
* Fixed entity to allow for any number of fields.
* Added new tests

1.1.0 / 2016-03-17
===================
* Added a getter and setter method for allowing any number of fields [set|get]AllowAnyField

1.0.3 / 2016-03-11
===================
* Fixed inflate method so that custom functions are called
* Added unit tests

1.0.2 / 2016-02-25
===================
* package name resolution fixed

1.0.1 / 2016-02-25
===================
* Collection entity fix to how entity name is resolved

1.0.0 / 2016-02-18
===================
* Initial release
