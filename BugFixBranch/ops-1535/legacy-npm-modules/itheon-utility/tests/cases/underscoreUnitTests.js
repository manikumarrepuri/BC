"use strict";

var assert = require("assert");

var _ = require("../../lib/underscore");

describe('Underscore Utility Test', () => {
  describe('Mixin Check', () => {
    it('should have camelize', () => {
      assert(typeof _.camelize === "function");
    });
    it('should have capitalize', () => {
      assert(typeof _.capitalize === "function");
    });
    it('should have dasherize', () => {
      assert(typeof _.dasherize === "function");
    });
    it('should have alphanumSort', () => {
      assert(typeof _.alphanumSort === "function");
    });
    it('should have instanceOf', () => {
      assert(typeof _.instanceOf === "function");
    });
  });

  describe('Function Tests', () => {
    it('should camelize strings correctly', () => {
      // I'm advised that the expected output here is correct, 
      // we're doing our own special kind of camel casing?
      assert.deepEqual(_.camelize("TestTest", true), "testTest");
      assert.deepEqual(_.camelize("TestTEST", true), "testTEST");
      assert.deepEqual(_.camelize("TestTest", false), "TestTest");
      assert.deepEqual(_.camelize("TestTEST", false), "TestTEST");
    });

    it('should dasherize strings correctly', () => {
      assert.deepEqual(_.dasherize("TestTest", true), "test-test");
      assert.deepEqual(_.dasherize("testTest", true), "test-test");
      assert.deepEqual(_.dasherize("test_Test", true), "test-test");
      assert.deepEqual(_.dasherize("test-Test", true), "test-test");
      assert.deepEqual(_.dasherize("test Test", true), "test-test");
    });

    it('should capitalize strings correctly', () => {
      assert.deepEqual(_.capitalize("testTest", true), "Testtest");
      assert.deepEqual(_.capitalize("TestTEST", true), "Testtest");
    });

    it('should sort arrays using alphanumSort correctly', () => {
      let test = ["z", "b", "20", "a", "c", "10", "1", "A", "2", "B", "3"];
      let output1 = _.alphanumSort(test, true);
      assert.deepEqual(output1, ['1', '2', '3', '10', '20', 'a', 'A', 'b', 'B', 'c', 'z']);
      let output2 = _.alphanumSort(test, false);
      assert.deepEqual(output2, ['1', '2', '3', '10', '20', 'A', 'B', 'a', 'b', 'c', 'z']);
    });

    // Test not currently functional - cannot repro the conditions of the bug reliably at present,
    // or prove that the function is in a working state.
    xit('should correctly detect when (x) is an instance of (y) object using instanceOf()', () => {     
      assert(_.instanceOf(rerror, Error), "Range Error object instanceOf Error (should be true)");
      assert(_.instanceOf(rerror, RangeError), "Range Error object instanceOf RangeError (should be true)");

      assert(!_.instanceOf(rerror, EvalError), "Range Error object instanceOf EvalError (should be false)");
      assert(!_.instanceOf(rerror, Function), "Range Error object instanceOf Function (should be false)");
    });
  });
});