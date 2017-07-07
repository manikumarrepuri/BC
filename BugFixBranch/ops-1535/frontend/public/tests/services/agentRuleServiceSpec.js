describe('Agent Rule Service', function() {

  var AgentRuleService, underscoreService, SearchService, SortService;

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

      AgentRuleService.get().then(function(response){
        results = response.data;
      });

      $httpBackend
        .whenGET(/^\/api\/agent-rules\?.*/).respond(function () {
          return [200, [{ foo: 'bar' }]];
        });

      expect($httpBackend.flush).to.not.throw();
      expect(results).to.deep.equal([{ foo: 'bar' }]);
    }));
  });
});
