angular.module('directives', []).directive('resize', function ($timeout) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs, controller) {
			angular.element(document).ready(function () {
				var calcHeight = function(targetElement) {
					let navbar = $('.navbar').outerHeight();
					let actionsBar = $('.actions-bar').outerHeight();
					let boxHeader = $('.box-header').outerHeight();
					let mainFooter = $('.main-footer').outerHeight();
					let mainHeader = $('.main-header').outerHeight();

					let minusHeight = (navbar + actionsBar + boxHeader + mainFooter +
						mainHeader);
					let windowHeight = $(window).height();

					$(targetElement).css('height', windowHeight - minusHeight);
				}
				// If RHP is active, change to 60%/40%, otherwise make it 100%
				var calcWidth = function() {
	        if ($('.main-page').hasClass('togglePane')) {
						$('.module-sidebar').css('width', '40%');
						$('.togglePane').css('margin-right', $('.module-sidebar').outerWidth());
	        } else {
						$('.main-page').css('margin-right', '0');
					}
				}

				var fixScrollbar = function () {
		      const windowHeight = $(window).height();
		      const headerHeight = $('.main-header').outerHeight();
		      const footerHeight = $('.main-footer').outerHeight();
		      const margin = 80;
		      $(".scroll-bar, .module-sidebar").css('height', (windowHeight - (headerHeight + footerHeight)) - margin);
		    }

        $(window).on('resize', function() {
					$timeout(function() {
						fixScrollbar();
						calcHeight(".scroll-bar");
						calcWidth();
						$('.ng-scope > .box-header').css('width', $('.scroll-bar .box').width());
						$('.box-header, .box').css('visibility', 'visible');
					},0);
        });
				$(window).resize();
			});
		}
	};
});
