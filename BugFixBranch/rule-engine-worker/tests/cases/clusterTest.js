"use strict";
var appRoot = require('app-root-path');
var assert = require('assert');

var ClusterService = require(appRoot + '/lib/clusterService');
const RedisGateway = require('opserve-common').gateway.RedisGateway;

var Q = require('q');

describe('ClusterService Tests', () => {
  it('testing getting initialization flags - both unset', function (done) {
    let client = require('redis-js').toPromiseStyle(Q.defer);
    let redisGateway = new RedisGateway(client);

    client.set('initialization_started', null);
    client.set('initialization_finished', null);

    let clusterService = new ClusterService({
      cache: redisGateway
    });
    clusterService.use('cache');

    let expected = {
      initialization_finished: '',
      initialization_started: ''
    };

    clusterService.getInitializationFlags()
      .then((result) => {
        assert.deepEqual(result, expected);
        done();
      }).catch((e) => {
        done(e);
      });
  });

  it('testing getting initialization flags - started only', function (done) {
    let client = require('redis-js').toPromiseStyle(Q.defer);
    let redisGateway = new RedisGateway(client);

    client.set('initialization_started', null);
    client.set('initialization_finished', null);

    let clusterService = new ClusterService({
      cache: redisGateway
    });
    clusterService.use('cache');

    var randomValue = Math.random().toString(36).substr(2);
    client.set('initialization_started', randomValue);

    let expected = {
      initialization_finished: '',
      initialization_started: randomValue
    };

    clusterService.getInitializationFlags()
      .then((result) => {
        assert.deepEqual(result, expected);
        done();
      }).catch((e) => {
        done(e);
      });
  });

  it('testing getting initialization flags - finished only', function (done) {
    let client = require('redis-js').toPromiseStyle(Q.defer);
    let redisGateway = new RedisGateway(client);

    client.set('initialization_started', null);
    client.set('initialization_finished', null);

    let clusterService = new ClusterService({
      cache: redisGateway
    });
    clusterService.use('cache');

    var randomValue = Math.random().toString(36).substr(2);
    client.set('initialization_finished', randomValue);

    let expected = {
      initialization_finished: randomValue,
      initialization_started: ''
    };

    clusterService.getInitializationFlags()
      .then((result) => {
        assert.deepEqual(result, expected);
        done();
      }).catch((e) => {
        done(e);
      });
  });

  it('testing setting initialization start flag', function (done) {
    let client = require('redis-js').toPromiseStyle(Q.defer);
    let redisGateway = new RedisGateway(client);

    client.set('initialization_started', null);
    client.set('initialization_finished', null);

    let clusterService = new ClusterService({
      cache: redisGateway
    });
    clusterService.use('cache');

    clusterService.setInitializationStartFlag()
    .then(() => {
      return clusterService.getInitializationFlags();
    })
    .then((result) => {
      assert.deepEqual('running', clusterService.getClusterInitializationState(result));
      done();
    }).catch((e) => {
      done(e);
    });
  });

  describe('Testing getting initialization states:', () => {
    let combinations = [
      [{
        initialization_finished: null,
        initialization_started: null
      },
        'not started'
      ],
      [{
        initialization_finished: null,
        initialization_started: new Date().getTime() - 10 * 1000 // 10 secs
      },
        'running'
      ],
      [{
        initialization_finished: false,
        initialization_started: new Date().getTime() - 10 * 1000 // 10 secs
      },
        'running'
      ],
      [{
        initialization_finished: false,
        initialization_started: new Date().getTime() - 70 * 1000 // 70 secs
      },
        'not started'
      ],
      [{
        initialization_finished: true,
        initialization_started: new Date().getTime()
      },
        'finished'
      ],
      [{
        initialization_finished: true,
        initialization_started: new Date().getTime() - 70 * 1000 // 70 secs
      },
        'finished'
      ]
    ];

    let client = require('redis-js').toPromiseStyle(Q.defer);
    let redisGateway = new RedisGateway(client);
    let clusterService = new ClusterService({
      cache: redisGateway
    });
    clusterService.use('cache');

    for (var index in combinations) {
      let singleCase = combinations[index];

      let expectedResult = singleCase.pop();
      let initializationFlags = singleCase.pop();

      it(`(started: ${initializationFlags.initialization_started}) + (finished: ${initializationFlags.initialization_finished}) = ${expectedResult}`, () => {
        assert.deepEqual(expectedResult, clusterService.getClusterInitializationState(initializationFlags));
      });
    }
  });
});
