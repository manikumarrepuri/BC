var filterService = angular.module('FilterService', ['underscoreService']);

filterService.factory('FilterService', ['$rootScope', '$http', '$timeout', '$q', '_', 'moment', function ($rootScope, $http, $timeout, $q, _, moment) {

  "use strict";

  var FilterService = angular.extend({});
  var filtersApiUrl = '/api/filters';
  FilterService.loaded = false;
  FilterService.filterForOverviewPage={};
  FilterService.filteredOverviewData={};
  FilterService.isFromOverview = false;
  FilterService.filterForAlerts = {};
  FilterService.predicateForAlerts = {};
  FilterService.persistedFilterOnPageChange = {};
  var filterThis={};
    
  //Save filter
  FilterService.saveFilter = function(filterCondition, filterAttributes) {
    return this.createFilter(filterCondition, filterAttributes).then(function(result){
      return result;
    });
  };
      
  // call to POST and create a new filter
  FilterService.createFilter = function(filterCondition, filterAttributes) {
    //Add in some required fields
    Object.keys(filterCondition).forEach((key) => (filterCondition[key] == null || filterCondition[key] == undefined) && delete filterCondition[key]);
    var filter = {};
    filter['uiElement'] = "Alerts";
    filter['filterName'] = filterAttributes.filterName;
    filter['isShared'] = filterAttributes.isShared;
    filter['userName'] = $rootScope.identity.username;
    filter['filterCondition'] = filterCondition;

    return $http.post(filtersApiUrl, filter)
      .then(function(result) {
        return result.data;
      });
  };

  //Create/Update a filter
  FilterService.getFilter = function() {
    var params = {};
    _.extend(params, {
      'conditions': {
        'userName': $rootScope.identity.username,
        'isShared': true
      }
    });
    var result = $http.get(filtersApiUrl + '?' + $.param(params));
    // var result = $http.get(filtersApiUrl);
    // formatting data
    return result.then(function(response) {
      return response.data[0];
    });
  };

  //This will prepare filter predicate to apply it in the alerts smart table.
  FilterService.applyFilters = function (data) {
    if(data.severityFilter){
      filterThis.severity = data.severityFilter.toString();}
    if(data.briefFilter){
      filterThis.brief = data.briefFilter;}
    filterThis.createdAt={};
    if(data.before){
      filterThis.createdAt.before = data.before;}
    if(data.after){
      filterThis.createdAt.after = data.after;}
    if(data.tagsFilter){
      filterThis.tags = data.tagsFilter;}
    if(data.groupFilter){
      filterThis.group = data.groupFilter;}
    if(data.nameFilter){
      filterThis.name = data.nameFilter;}
    if(data.stateFilter){
      filterThis.state = data.stateFilter;}
    if(data.assigneeFilter){
      filterThis.assignee = data.assigneeFilter;}
    if(data.ruleNameFilter){
      filterThis.ruleName = data.ruleNameFilter;}
    if(data.selectedOption && data.selectedOption != "All"){
      filterThis.acknowledged = (data.selectedOption == "Yes"?"true":"!true");}
      return filterThis;
  };

  return FilterService;
}]);
