'use strict';

var appRootPath     = require("app-root-path");
var SchedulerError  = require("./schedulerError");
var Task            = require("./task");
var _               = require("itheon-utility").underscore;
var logger          = require("itheon-logger");
const EventEmitter  = require('events');
var later           = require('later');

/**
*
 */
class Scheduler extends EventEmitter
{
  /**
   * Constructor needs to be overriden by extending class
   */
  constructor()
  {
    super();
    this.scheduledTasks = [];
  }

  getTaskList()
  {
    return this.scheduledTasks;
  }

  /*
  * Create a schedule for a given job and name
  * @param name string
  * @param spec Later.js parseable string/CRON expression
  * @param callback function
  * @return object task
  */
  schedule(name, spec, callback)
  {

    //Validate that the spec is a string
    if(typeof spec != 'string') {
      throw new SchedulerError(
        "Invalid schedule passed, expected a string received: " + typeof spec,
        {
          schedule: spec
        }
      );
    }

    // Attempt to parse the spec to ensure it is a valid later.js expression
    try {
      var schedule = this.parseSpec(spec);
    }
    catch(e) {
      throw new SchedulerError(
        "Unexpected error parsing schedule - " + e.message,
        {
          spec: spec,
          error: e
        }
      );
      return null;
    }

    //Attempt to create a new task
    try {
      this.scheduledTasks[name] = new Task(name, schedule, callback);
    }
    catch(e) {
      throw new SchedulerError(
        "Faield to create scheduled task - " + e.message,
        {
          spec: spec,
          error: e
        }
      );
      return null;
    }

    // Bubble up the task level scheduled event
    this.scheduledTasks[name].on('scheduled', function(task) {
      //When a task is ready we emit an event that can be tracked
      setTimeout(() => this.emit('taskScheduled', task), 0);
    });

    // Bubble up the task level fired event
    this.scheduledTasks[name].on('fired', function(task) {
      //When a task is ready we emit an event that can be tracked
      setTimeout(() => this.emit('taskFired', task), 0);
    });

    // Bubble up the task level fired event
    this.scheduledTasks[name].on('canceled', function(task) {
      //When a task is ready we emit an event that can be tracked
      setTimeout(() => this.emit('taskCanceled', task), 0);
    });

    //Return the task
    return this.scheduledTasks[name];
  }

  parseSpec(spec) {
    let schedule = null;
    //Validate schedule
    if (/^[A-Za-z]{1}/.test(spec)) {
      schedule = later.parse.text(spec);
    //Check for a valid cron
    } else {
      //For some reason later.js seems to accept any old string as a cron we'll be a bit more picky
      var cronRegex = new RegExp("^([*?]|[0-5]?[0-9]|[*?]\/[0-9]+)\\s" +
                "([*?]|1?[0-9]|2[0-3]|[*?]\/[0-9]+)\\s" +
                "([*?]|[1-2]?[0-9]|3[0-1]|[*?]\/[0-9]+)\\s" +
                "([*?]|[0-9]|1[0-2]|[*?]\/[0-9]+|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\\s" +
                "([*?]\/[0-9]+|[*?]|[0-7]|sun|mon|tue|wed|thu|fri|sat)\\s*" +
                "([*?]\/[0-9]+|[*?]|[0-9]+)?$", 'i');

      //Ensure the spec is a valid cron expression
      if (!cronRegex.test(spec)) {
        throw new SchedulerError(
          "Invalid CRON expression passed.",
          {
            spec: spec
          }
        );
      }

      var cron = spec.split(' ');
      //Check if we have seconds and parse the cron expression
      schedule = later.parse.cron(spec, cron.length == 6);
    }

    //If for some reason we don't have a schedule then stop here
    if (!schedule) {
      throw new SchedulerError(
        "Failed to generate schedule.",
        {
          spec: spec
        }
      );
    }

    //Check if we found a parse error with the spec
    if (schedule.error && schedule.error != -1) {
      throw new SchedulerError(
        "Parse error in schedule at string position: " + schedule.error,
        {
          spec: spec
        }
      );
    }

    //Check that the schedule can be used ie. it's not in the past
    if(later.schedule(schedule).next() == later.NEVER) {
      throw new SchedulerError(
        "No valid 'next' schedule found.",
        {
          spec: spec,
          schedule: schedule
        }
      );
    }

    return schedule;
  }

  findTaskById(taskName) {
    var task = this.scheduledTasks[taskName];
    if(typeof task == 'undefined') {
      return null;
    }

    return task;
  }

  rescheduleTask(task, spec)
  {
    if (!(task instanceof Task)) {
      throw new SchedulerError(
        "Expecting instanceof Task but received: " + typeof task,
        {
          task: task
        }
      );
    }

    try {
      let schedule = this.parseSpec(spec);
    }
    catch(e) {
      throw new SchedulerError(
        "Unexpected error parsing schedule - " + e.message,
        {
          spec: spec,
          error: e
        }
      );
    }

    if (task.cancel(true, schedule)) {
      return task;
    }

    return null;
  }

  cancelTask(task)
  {
    var success = false;

    if (!(task instanceof Task)) {
      throw new SchedulerError(
        "Expecting instanceof Task but received: " + typeof task,
        {
          task: task
        }
      );
    }

    if(task.cancel()) {
      //Remove from task list
      delete this.scheduledTasks[task.name];
      return true;
    }

    return false;
  }
}

module.exports = Scheduler;
