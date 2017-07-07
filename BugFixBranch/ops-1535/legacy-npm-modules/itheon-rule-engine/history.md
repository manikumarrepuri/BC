2.0.3 / 2016-07-05
==================
* Bug Fix: It seems that numbers were being compared as strings so added some code to cast to float.

2.0.2 / 2016-06-28
===================
* Bug Fix: All entities were being checked when new entity level metrics were added.

2.0.1 / 2016-06-09
===================
* Bug Fix: The severity is now returned.

2.0.0 / 2016-05-12
===================
* Removed the use of entities.

1.1.3 / 2016-04-05
===================
* update to require filename case

1.1.2 / 2016-03-24
===================
* Bug fixes

1.1.1 / 2016-03-24
===================
* Bug fix: Copied the word function across killed everything

1.1.0 / 2016-03-24
===================
* Altered the rule engine to allow for no thresholds to be set
* Created new function getUniqueFieldsUsed() which recursively get's a list of all the properties used
  this allows you to check when a rule should be run.


1.0.0 / 2016-03-21
===================
* Initial release
