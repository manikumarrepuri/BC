Itheon Module Reminder Entity
==========================

Itheon Module Reminder Entity provides common Reminder module related entities used is Itheon software.

## Sample usage ##

#### Itheon Module Reminder Entity ####

```js
var ReminderEntity = require("itheon-module-reminder-entity").ReminderEntity;
var reminderEntity = new ReminderEntity({"description": "get up and go to work."});
```

#### Itheon Module Scheduled Reminder Entity ####

```js
var ScheduledReminderEntity = require("itheon-module-reminder-entity").ScheduledReminderEntity;
var scheduledReminderEntity = new ScheduledReminderEntity({"schedule": "every Weekday at 8am", "description": "get up and go to work."});

[![Build Status](http://10.187.75.150:9443/buildStatus/icon?job=Build - itheon-module-reminder-entity)](http://10.187.75.150:9443/view/unit-test/job/Build%20-%20itheon-module-reminder-entity/)
