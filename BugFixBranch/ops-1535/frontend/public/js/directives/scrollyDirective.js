angular.module('directives', [])
  .directive('scrolly', ['$window', '$timeout', function($window, $timeout) {
        return {
          restrict: 'A',
          scope: {
            scrollyOffset: '=',
            scrollyDistance: '=',
            scrollyMouseArea: '='
          },
          link: function(scope, element, attrs) {
            var elm, scrollTopIcon, scrollBottomIcon, moreBottom, moreTop, windowElement, topOffset, mouseArea, iconHeight, visibleHeight, timeout, elmBounds, scrollTop, scrollDistance, scrollableDistance, scrollHeight;
            windowElement = angular.element($window);
            mouseArea = parseInt(scope.scrollyMouseArea) || 100;
            scrollDistance = parseInt(scope.scrollyDistance) || 20;
            scrollableDistance = null;
            elmBounds = null;

            //cache some things
            elm = element[0];
            $elm = $(elm);
            topOffset = $('app-header > .main-header').height();
            iconHeight = $(element).find('.scrolly-icon-bottom').height();
            timeout = null;

            createElements = function() {
              //Create needed HTML elements
              var html = '<div class="scrolly-icon hide scrolly-icon-top"> ' +
                '<i class="fa fa-arrow-up fa-1x"></i>' +
                '</div>' +
                '<div class="scrolly-icon hide scrolly-icon-bottom">' +
                '<i class="fa fa-arrow-down fa-1x"></i>' +
                '</div>' +
                '<div class="scrolly-box hide scrolly-box-top" title="Jump to Top"> ' +
                '<i class="fa fa-arrow-up"></i>' +
                '</div>' +
                '<div class="scrolly-box hide scrolly-box-bottom" title="Jump to Bottom"> ' +
                '<i class="fa fa-arrow-down"></i>' +
                '</div>';

              //Add to the DOM
              $(html).prependTo(element);

              //Cache element selectors
              scrollTopIcon = $elm.find('.scrolly-icon-top');
              scrollBottomIcon = $elm.find('.scrolly-icon-bottom');
              moreTop = $elm.find('.scrolly-box-top');
              moreBottom = $elm.find('.scrolly-box-bottom');
            };
            isScrollable = function() {
              //Get information about the element size
              elmBounds = elm.getBoundingClientRect();
              //Workout how far we've scrolled.
              scrollTop = $elm.scrollTop();
              //Get how tall the element is when fully scrolled.
              scrollHeight = $elm[0].scrollHeight;
              //Workout how far we can scroll
              scrollableDistance = (scrollHeight - elmBounds.height);
              //Workout how much of the element can be seen
              visibleHeight = elmBounds.height - topOffset;

              //Setup box positions
              moreTop.css('top', topOffset + 'px');
              moreBottom.css('top', ($elm.height() + topOffset - 20) + 'px');

              //If element can be scrolled show the more bottom box
              if (scrollableDistance && scrollTop < scrollableDistance) {
                moreBottom.removeClass('hide');
                return;
              }

              //otherwise ensure the boxes are hidden
              moreTop.addClass('hide');
              moreBottom.addClass('hide');
            };
            resizeHandler = function() {
              topOffset = $('app-header > .main-header').height();
              isScrollable();
            };
            jumpToTop = function() {
              $elm.scrollTop(0);
            };
            jumpToBottom = function() {
              $elm.scrollTop(scrollableDistance + 100);
            };
            mouseMoveHandler = function(event) {
              //If there is nothing to scroll end here;
              if (!scrollableDistance) {
                return;
              }

              //Workout where the mouse is within the element
              var mouseY = (event.clientY - elmBounds.top) - topOffset;
              //Workout how far we've scrolled.
              var scrollTop = $elm.scrollTop();

              //Check if the mouse is near the top
              if (mouseY < mouseArea) {
                //We're already at the top we're done here
                if (scrollTop <= 0) {
                  moreTop.addClass('hide');
                  return;
                }
                scrollTopIcon.removeClass('hide');
                scrollTopIcon.css('top', topOffset + 10 + scrollTop + 'px');
                //Reduce scoll amount
                $elm.scrollTop(scrollTop - scrollDistance);
              }
              //Check if the mouse is near the bottom
              else if (mouseY > (visibleHeight - mouseArea)) {
                //The scroll height changes when these div's are visible
                var currentHeight = scrollableDistance +
                (moreTop.is(':visible') ? moreTop.height() : 0 ) +
                (moreBottom.is(':visible') ? moreBottom.height() : 0 );

                //We're already at the bottom we're done here
                if (scrollTop >= currentHeight) {
                  moreBottom.addClass('hide');
                  return;
                }
                scrollBottomIcon.removeClass('hide');
                scrollBottomIcon.css('top', (elmBounds.height + (scrollTop - iconHeight - 40)) + 'px');
                $elm.scrollTop(scrollTop + scrollDistance);

                //For some reason it fails to hide the moreBottom section if you resize the window
                if(scrollTop == $elm.scrollTop()) {
                  scrollableDistance = scrollTop -
                  (moreTop.is(':visible') ? moreTop.height() : 0 ) -
                  (moreBottom.is(':visible') ? moreBottom.height() : 0 );
                }
              }
              //If aren't moving the div up/down we're done here
              else {
                return;
              }

              //We're going to hide the scrolling icon if the user isn't moving the mouse/there is nothing more to do
              $timeout.cancel(timeout);
              timeout = $timeout(function() {
                scrollTopIcon.addClass('hide');
                scrollBottomIcon.addClass('hide');
              }, 200);

              //Make the more contents boxes visible if need be
              //If we aren't at the top show the box
              if (scrollTop > 0) {
                moreTop.removeClass('hide');
              }

              //If we aren't at the bottom show the box
              if (scrollTop < scrollableDistance) {
                moreBottom.removeClass('hide');
              }
            }

            //Add DOM elements
            createElements();

            //Create an observer instance
            var observer = new MutationObserver(function(mutations) {
              //Once we get here the height is now set correctly
              isScrollable();
              //We don't need to do this again.
              observer.disconnect();
            });

            //Pass in the target node, as well as the observer options
            observer.observe(elm, { attributes: true });

            //Bind to the resize event so we can update some cached things
            windowElement.bind('resize', resizeHandler);
            //Bind to the mousemove handler so that we can alter things when the user moves the mouse around
            element.bind('mousemove', mouseMoveHandler);

            //Bind to click events
            moreTop.on('click', jumpToTop);
            moreBottom.on('click', jumpToBottom);

            //If this directive get's destoryed unbind
            scope.$on('$destroy', function() {
              windowElement.unbind('resize', resizeHandler);
              element.unbind('scroll', mouseMoveHandler);
              moreTop.off('click', jumpToTop);
              moreBottom.off('click', jumpToBottom);
            });
          }
        }
      }]);
