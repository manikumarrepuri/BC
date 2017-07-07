1.4.0 / 2016-12-01
===================
* Added itheonx7Event handler

1.3.5 / 2016-07-01
===================
* Altered debug output for httpSender so that it is useable now returns response.headers and response.body only.

1.3.4 / 2016-07-01
===================
* Added system tags to the ItheonXEvent handler

1.3.3 / 2016-06-29
===================
* Bug: Patch request was unsupported for httpSender

1.3.2 / 2016-06-27
===================
* Made changes so the package works with the rule-engine-handler
* Altered the subscribers so they do not need a constructor anymore

1.3.1 / 2016-04-18
===================
* Fixed an issue with the subscriber onError not firing
* Corrected a variable name to originalEvent

1.3.0 / 2016-04-07
===================
* Refactored the parse method to the subscriber service
* Refactored the errorLog to a file sender.
* Added a AMQP sender.
* Added a SOAP sender.

1.2.0 / 2016-04-01
===================
* Refactored the retry method to the subscriber service
* Added a mail sender.
* Added a webhook sender.
* Added a SSH command sender.

1.1.0 / 2016-03-22
===================
* Allowed a subscriber to be an object to allow passing of settings
* Fixed up tcpSender to use the passed in settings

1.0.2 / 2016-03-17
===================
* Update to include require-all package
* A fix for baseDir path

1.0.1 / 2016-03-17
===================
* Updated file dependencies

1.0.0 / 2016-03-17
===================
* Initial release
