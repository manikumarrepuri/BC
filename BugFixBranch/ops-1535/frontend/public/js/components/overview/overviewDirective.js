angular.module('itheonApp').directive('overview', ['$rootScope','AlertService','FilterService', '_', 'socket', '$q', '$timeout','$route','$location', function($rootScope, AlertService, FilterService, _, socket, $q, $timeout, $route, $location){

  "use strict";

  return {
    scope: {},
    controllerAs: 'overviewCtrl',
    controller: function($scope, $element) {
      var ctrl = this;
      ctrl.filterThis={};
      ctrl.alerts = AlertService.items;
      ctrl.service = AlertService;
      ctrl.display = 'list';
      ctrl.busy = true;
      ctrl.allFilters = [];
      ctrl.persistentFilterCount = 0;
      ctrl.svgContainerStyle;

      //Filters and returns the highest severity alert for the given alert(s) collection
      ctrl.getHighestSeverityAlerts = function(result){
        ctrl.busy = true;
        console.log('filters and alerts data is ready');
        var forEachCount=0;
        _.each(result, function(item,i) {
            //frame the filter object
            $timeout(function() {
              FilterService.filterForOverviewPage = FilterService.applyFilters(item.filterCondition);
              document.getElementById('applyFiltersButton').click();
              return item;
            }).then(function(filter){
              if(FilterService.filteredOverviewData && FilterService.filteredOverviewData.length>0){
                var minRow = _.min(FilterService.filteredOverviewData, function(alert){ return alert.severity; });
                var newRow = angular.copy(minRow);
                FilterService.filteredOverviewData = {};
                //Add filterName to show in the UI
                //Add _id to retrieve the filter(s) on node click, then redirect tha page to Alerts screen and apply the same filter. 
                newRow.filterName = filter.filterName;
                newRow.filterId = filter._id;
                newRow._id = filter._id;
                newRow.filterData = filter;
                newRow.userName = filter.userName;
                ctrl.allFilters.push(newRow);
              }
              forEachCount++;
              if(ctrl.persistentFilterCount == forEachCount){
                d3Start(ctrl.allFilters);
                ctrl.busy = false;
              }
            });  
        });
      };

      //Gets all the alerts from the db
      ctrl.getAlerts = function(){
        ctrl.busy = true;
        return AlertService.get({storage: "db"}, true).then(function() {
          console.log('Retrieved alerts data from API');
          ctrl.display = 'table';
          ctrl.busy = false;
          return;
        });
      };

      //Gets persistent filters from db
      ctrl.getPersistentFilters = function(){
        ctrl.busy = true;
        return FilterService.getFilter()
          .then(function(result) {
            if(result){
              ctrl.persistentFilterCount = result.length;
            }
            ctrl.busy = false;  
          return result;
        });
      };

      ctrl.loadPage = function() {
        ctrl.busy = true;
        var counter = 1;
        var startingPromise;
        //Get all the alerts
        startingPromise = ctrl.getAlerts();
        return startingPromise.then(function(){
          return ctrl.getPersistentFilters();
        }).then(function(result){
          //We have got the all saved persistent filters and alerts data. Get the highest severity record for each filter.
          ctrl.getHighestSeverityAlerts(result);
          ctrl.busy = false;
        });
      };
      
      //Page load
      ctrl.loadPage();
      
      //d3 Visualisation Starts
      function d3Link(d) {
        return "M" + d.y + "," + d.x
          + "C" + (d.y + d.parent.y) / 2 + "," + d.x
          + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
          + " " + d.parent.y + "," + d.parent.x;
      }

      function d3Visualise(root) {
        var nodes = d3.select('.nodes')
          .selectAll('g.node')
          .data(root.descendants());

        var enteringNodes = nodes.enter()
          .append('g')
          .classed('node', true)
          .attr('transform', function(d) {
            return 'translate(' + d.y + ',' + d.x + ')';
          });

        enteringNodes
          .append('circle')
          .attr('r', 6)
          .attr('style', function(d) {
            if(d.depth == 3) {
              //style the alert
              if(d.data.severity >= 7 || d.data.severity == 5){
                return "fill: green;cursor:pointer"  
              }else if(d.data.severity >= 3 && d.data.severity  <= 6 && d.data.severity != 5){
                return "fill: orange;cursor:pointer"  
              }else if(d.data.severity  <= 2){
                return "fill: red;cursor:pointer"  
              }else{
                return "cursor:pointer";
              }
            }
            return "cursor:pointer";
          })
          .on('click', function(d, i){
            switch (d.depth) {
              case 1:
                break;
              case 2:
                //redirect to Alerts page and apply the selected filter criteria
                // FilterService.isFromOverview = true;
                // FilterService.filterForAlerts = d.children[0].data.filterData;
                // $location.path("/alerts");
                break;
              case 3:
                //redirect to Alerts page and apply the selected filter criteria
                //d.data.filterId
                //FilterService.isFromOverview = true;
                break;
            }
          });

        enteringNodes
          .append('text')
          .attr('x', 6)
          .attr('y', 4)
          .text(function(d) {
            switch(d.depth) {
            case 0:
              return "Filters";
            case 1:
            case 2:
              return d.data.key;
            case 3:
              return d.data.severity;
            }

            return '';
          });

        var links = d3.select('.links')
          .selectAll('path')
          .data(root.descendants().slice(1));

        links.enter()
          .append('path')
          .attr('d', d3Link);
      }

      function d3Start(data) {
        var nest = d3.nest()
          .key(function(d) { return ($rootScope.identity.username == d.userName?"My Filters":"Shared");})
          .key(function(d) { return d.filterName; })
          .entries(data);

        nest = {
          key: 'root',
          values: nest
        };

        var root = d3.hierarchy(nest, function(d) {
          return d.values;
        });
        ctrl.svgHeight = ctrl.allFilters.length * 20;
        ctrl.svgWidth = 1000;
        var treeLayout = d3.tree()
          .size([ctrl.svgHeight, ctrl.svgWidth]);
        treeLayout(root);
        d3Visualise(root);
      }
      //d3 Visualisation Ends

    },
    link: function(scope, element, attrs) {},
    templateUrl: '/static/js/components/overview/overview.html'
  };
}]);
