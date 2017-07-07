
"use strict";

let appRootPath = require("app-root-path");
let assert      = require("chai").assert;
let sinon       = require("sinon");
let later       = require("later");
let _           = require("itheon-utility").underscore;
let Scheduler   = require(appRootPath + "/lib/scheduler");
let Task        = require(appRootPath + "/lib/task");

sinon.assert.expose(assert, { prefix: "" });

describe("Itheon-Scheduler", function() {
  describe("Scheduler basic initalise tests.", function () {
    var scheduler = new Scheduler();

    it("should have a blank task list", function () {
      assert.deepEqual(scheduler.getTaskList(), [], 'Function returned expected result object');
    });

    it("should add a task", function () {
      var task = scheduler.schedule("1234-1234-1234-1234", "every 4 minutes");
      assert.ok(task instanceof Task, 'New task created as expected.');
      task.cancel();
    });
  });

  describe("Schedule tasks run as expected.", function () {
    var scheduler = new Scheduler();

    it("should run a task once at some date", function(done) {
      this.timeout(3000);

      var task = scheduler.schedule("1234-1234-1234-1234", "every 2 seconds", function() {
        assert.ok(true);
        done();
      });

      setTimeout(function() {
        task.cancel();
      }, 2000);
    });

    it("should emit initial 'scheduled' event", function(done) {
      this.timeout(3000);

      var task = scheduler.schedule("1234-1234-1234-1234", "every 2 seconds", function() {});

      task.on('scheduled', function() {
        assert.ok(true);
      });

      setTimeout(function() {
        task.cancel();
        done();
      }, 2000);
    });

    it("should emit 'fired' event on occurence of schedule", function(done) {
      this.timeout(3000);

      var task = scheduler.schedule("1234-1234-1234-1234", "every 2 seconds", function() {});

      task.on('fired', function() {
        assert.ok(true);
      });

      setTimeout(function() {
        task.cancel();
        done();
      }, 2000);
    });

    it("should emit 'canceled' event", function(done) {
      this.timeout(3000);

      var task = scheduler.schedule("1234-1234-1234-1234", "every 2 seconds", function() {});
      task.cancel();

      task.on('canceled', function() {
        assert.ok(true);
      });

      setTimeout(function() {
        done();
      }, 2000);
    });

    it("Should run tasks at interval based on text string, repeating indefinitely", function(done) {
      this.timeout(3500);

      var spy = sinon.spy();
      var task = scheduler.schedule("test", "every 1 seconds", spy);

      setTimeout(function() {
        task.cancel();
        assert.ok(spy.calledThrice);
        done();
      }, 3250);
    });

/*
* This does work but it appears the first schedule is from the next full minute.
* ie. If the time is 17:29:36 the schedule will start at 17:30:(01,02,03) etc.
    it("Should run tasks at interval based on cron string, repeating indefinitely", function(done) {
      this.timeout(3500);

      var spy = sinon.spy();
      var task = scheduler.schedule("test", "1 * * * * *", spy);

      setTimeout(function() {
        task.cancel();
        assert.ok(spy.calledThrice);
        done();
      }, 3250);
    });
*/

    it("Doesn't invoke job if schedule is in the past", function(done) {
      this.timeout(1250);

      assert.throws(
        () => scheduler.schedule("test", "at 5:00 pm every 1 day of March in 2015", function() {}),
        "Unexpected error parsing schedule - No valid 'next' schedule found."
      );

      setTimeout(function() {
        done();
      }, 1000);
    });
  });
});
