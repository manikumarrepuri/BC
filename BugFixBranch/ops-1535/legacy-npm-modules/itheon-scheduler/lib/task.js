'use strict';

var later          = require('later');
const EventEmitter = require('events');

class Task extends EventEmitter
{
  constructor(name, schedule, callback)
  {
    super();
    //Store the tasks name
    this.task = name;
    //Store the schedule
    this.schedule = schedule;
    //Store the next date this event will occur
    this.fireDate = later.schedule(this.schedule).next();
    // Whether to skip the next schedule or not
    this.skipNext = false;
    // An array of times this task has been called.
    this.invocations = [];

    //Configure return type
    this.callback = typeof callback === 'function' ? callback : false;
    //Should this recur
    this.recurs = !(typeof schedule.schedules[0].t != 'undefined' && schedule.schedules[0].t.length == 1);
    //Set timer
    this.timer = (this.recurs) ? later.setInterval(() => this.invoke(), this.schedule) : later.setTimeout(() => this.invoke(), this.schedule);

    //Log how many times we have run this task
    this.triggeredTasks = 0;

    setTimeout(
      () => this.emit('scheduled', {
        name: name,
        fireDate: this.fireDate
      }
    ), 0);
  }

  getTriggeredTasks()
  {
    return this.triggeredTasks;
  }

  setTriggeredTasks(triggeredTasks)
  {
    triggeredTasks = triggeredTasks;
  }

  invoke()
  {
    this.currentInvocation = this.fireDate;
    this.fireDate = later.schedule(this.schedule).next();

    //Check if we should be skipping this invocation
    if(this.skipNext) {
      this.skipNext = false;
      return;
    }

    // Save the fact that this task was fired.
    this.setTriggeredTasks(this.getTriggeredTasks() + 1);
    this.invocations.push(this.currentInvocation);

    //When a task is ready we emit an event that can be tracked
    setTimeout(
      () => this.emit('fired', {
        name: this.name,
        fireDate: this.currentInvocation,
        nextFireDate: this.fireDate
      }
    ), 0);

    //If we have a callback function now is the time to call it.
    if(this.callback) {
      this.callback();
    }
  }

  cancel(reschedule, schedule)
  {
    //If there is an active timer disable it
    if(this.timer) {
      this.timer.clear();
    }

    //If we should reschedule then workout when that should happen
    if(reschedule) {
      this.sched = schedule;
      this.timer = (this.recurs) ? later.setInterval(this.invoke(), this.schedule) : later.setTimeout(this.invoke(), this.schedule);
    }

    // Emit a canceled event be sure to say if the event was rescheduled
    setTimeout(
      () => this.emit('canceled', {
        name: this.name,
        rescheduled: reschedule,
        fireDate: this.fireDate
      }
    ), 0);

    return true;
  }

  cancelNext()
  {
    this.skipNext = true;
  }

  getInvocations()
  {
    return this.invocations;
  }

}

module.exports = Task;
