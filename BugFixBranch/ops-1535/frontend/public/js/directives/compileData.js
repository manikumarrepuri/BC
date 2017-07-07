angular.module('itheonApp')
.directive( 'compileData', function ( $compile ) {
  return {
    scope: true,
    link: function ( scope, element, attrs) {
      var elmnt;
      var controller;

      attrs.$observe( 'controller', function ( ctrl ) {
        controller = ctrl;
      });

      attrs.$observe( 'template', function ( myTemplate ) {
        if ( angular.isDefined( myTemplate ) ) {
          if ( angular.isDefined( controller) ) {
            myTemplate = myTemplate.replace('ctrl.', controller + '.');
          }

          //Very rudimental test if it is wrapped in html
          if(!/^<[A-Za-z](.*)>$/.test(myTemplate)) {
            //Wrap the template in a span
            myTemplate = angular.element("<span>" + myTemplate + "</span>");
          }
          // compile the provided template against the current scope
          elmnt = $compile( myTemplate )( scope );
          element.html(""); // dummy "clear"
          element.append( elmnt );
        }
      });
    }
  };
});
