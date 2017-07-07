describe('Agent Rule Service', function() {

  var AgentRuleService, underscoreService, SearchService, SortService;
  //The array of users our factory will provide us
  var agentRuleList = [{
      "agentRuleId":  "16b2847e-339e-4b1b-8567-42a1b8138402" ,
      "content":  "test" ,
      "createdAt": "Tue Jul 12 2016 16:35:51 GMT+00:00" ,
      "description":  "almond" ,
      "fileName":  "almond" ,
      "id":  "16b2847e-339e-4b1b-8567-42a1b8138402" ,
      "name":  "almond" ,
      "status": 1 ,
      "tags": [
        "system:platform:os400"
      ] ,
      "updatedAt": "Thu Jan 01 1970 00:00:00 GMT+00:00" ,
      "version":  "1468341351"
    },
    {
      "agentRuleId":  "7ade0b23-0db5-4deb-a3c6-951f63ff4eef" ,
      "content":  "RULE CPUBusy SELECTION x=y CONDITION x=y" ,
      "createdAt": "Tue Jul 12 2016 16:36:51 GMT+00:00" ,
      "id":  "0a436afb-08e0-432c-92fe-322e2d316f40" ,
      "name":  "CPUBusy" ,
      "results": { } ,
      "status": 1 ,
      "tags": [
        "system:customer:Nampack" ,
        "system:host:server1"
      ] ,
      "updatedAt": "Thu Jan 01 1970 00:00:00 GMT+00:00" ,
      "version":  "1461331558"
    }];

  //The single user we expect to receive when calling findById('2')
  var singleAgentRule = [{
    "agentRuleId":  "16b2847e-339e-4b1b-8567-42a1b8138402" ,
    "content":  "test" ,
    "createdAt": "Tue Jul 12 2016 16:35:51 GMT+00:00" ,
    "description":  "almond" ,
    "fileName":  "almond" ,
    "id":  "16b2847e-339e-4b1b-8567-42a1b8138402" ,
    "name":  "almond" ,
    "status": 1 ,
    "tags": [
      "system:platform:os400"
    ] ,
    "updatedAt": "Thu Jan 01 1970 00:00:00 GMT+00:00" ,
    "version":  "1468341351"
  }];

  beforeEach(function() {
    angular.mock.module('AgentRuleService');
    angular.mock.module('underscoreService');
    angular.mock.module('SearchService');
    angular.mock.module('SortService');
  });

  // Before each test set our injected AgentRuleService factory (_AgentRuleService__) to our local AgentRuleService variable
  beforeEach(inject(function($http, $timeout, $q, _AgentRuleService_, _, _SearchService_, _SortService_) {
    mockHTTP = $http;
    mockTimeout = $timeout;
    mockQ = $q;
    AgentRuleService = _AgentRuleService_;
    underscoreService = _;
    SearchService = _SearchService_;
    SortService = _SortService_;
  }));

  // A simple test to verify the AgentRuleService factory exists
  it('should exist', function() {
    expect(AgentRuleService).to.exist;
  });

  // A set of tests for our Users.all() method
  describe('.get()', function() {
    // A simple test to verify the method all exists
    it('should exist', function() {
      expect(AgentRuleService.get).to.exist;
    });

    it('should return data, expect (200 status)', inject(function($httpBackend) {
      var results;

      AgentRuleService.get({}, true).then(function(response){
        results = response.data;
      });

      $httpBackend
        .whenGET(/^\/api\/agent-rules\?.*/).respond(function () {
          return [200, agentRuleList, { headers: {'X-Total-Count': 2 }}];
        });

      expect($httpBackend.flush).to.not.throw();
      expect(results).to.deep.equal( agentRuleList );
      expect(AgentRuleService.totals.active).to.deep.equal( 2 );
    }));
  });

  // A set of tests for our Users.all() method
  describe('.getById()', function() {
    // A simple test to verify the method all exists
    it('should exist', function() {
      expect(AgentRuleService.getById).to.exist;
    });

    // A test to verify that calling findById() with an id, in this case '2', returns a single user
    it('should return one agent rule object if it exists, expect (200 status)', inject(function($httpBackend) {
      var result;

      AgentRuleService.getById("16b2847e-339e-4b1b-8567-42a1b8138402").then(function(response){
        result = response;
      });

      $httpBackend
        .whenGET(/^\/api\/agent-rules\?.*/).respond(function () {
          return [200, singleAgentRule];
        });

      expect($httpBackend.flush).to.not.throw();
      expect(result).to.deep.equal( singleAgentRule[0] );
    }));

    // A test to verify that calling findById() with an id that doesn't exist, in this case 'ABC', returns undefined
    it('should return undefined if the agent rule cannot be found, expect (200 status)', inject(function($httpBackend) {
      var result;

      AgentRuleService.getById("16b2847e-339e-4b1b-8567-42a1b8138402").then(function(response){
        result = response;
      });

      $httpBackend
        .whenGET(/^\/api\/agent-rules\?.*/).respond(function () {
          return [200, []];
        });

      expect($httpBackend.flush).to.not.throw();
      expect(result).to.be.undefined;
    }));
  });
});
