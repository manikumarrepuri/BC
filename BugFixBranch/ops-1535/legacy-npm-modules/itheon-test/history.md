2.5.0 / 2016-10-17
==================
* Added a stub for deviceRethinkDbGateway.

2.4.0 / 2016-10-05
==================
* Added a stub for the AmqpDataProvider

2.3.5 / 2016-10-04
==================
* Removed a console.log() call that was polluting a unit test's output.

2.3.4 / 2016-10-03
==================
* Added platform-agnostic path resolution for dataProviders in order to allow for tests to run on windows.

2.3.3 / 2016-09-05
===================
* Support for "cases" path and autoloading dataProviders

2.3.0 / 2016-08-31
===================
* Allow to inflate baseEntity via contructor

2.2.2 / 2016-07-20
===================
* Support for tests under "cases" directory

2.2.1 / 2016-03-14
===================
* Didn't save dependencies to package.json

2.2.0 / 2016-03-14
===================
* Added BaseError stub
* Added TestExpress based on "npm mock-express"
* Extended EntityError from BaseError stub

2.1.1 / 2016-03-11
===================
* Fixed the baseEntity so that it create's an id attribute as required

2.1.0 / 2016-03-11
===================
* Added baseEntity Stub

2.0.1 / 2016-03-11
===================
* Removed the requirement for baseError (which needs itheon-config)

2.0.0 / 2016-03-11
===================
* Added new stubs package
* Removed the requirement for itheon-logger

1.0.0 / 2016-02-17
===================
* Initial release
