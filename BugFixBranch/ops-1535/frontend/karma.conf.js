// Karma configuration
// Generated on Wed Aug 03 2016 10:50:13 GMT+0100 (BST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      './public/js/vendor/jquery/dist/jquery.min.js',
      './public/js/vendor/angular/angular.js',                                    // angular
      './public/js/vendor/angular-route/angular-route.js',                        // angular-route
      './public/js/vendor/angular-mocks/angular-mocks.js',                        // angular-mocks
      './public/js/vendor/angular-socket.io-mock/angular-socket.io-mock.js',      // socket.io.mock
      'https://cdn.socket.io/socket.io-1.3.7.js',
      './public/js/vendor/stackframe/stackframe.js',
      './public/js/vendor/error-stack-parser/error-stack-parser.js',
      './public/js/vendor/underscore/underscore-min.js',
      './public/js/vendor/angular-sanitize/angular-sanitize.min.js',
      './public/js/vendor/moment/moment.js',
      './public/js/vendor/angular-moment/angular-moment.js',
      './public/js/vendor/ui-select/dist/select.min.js',
      './public/js/vendor/ngSticky/dist/sticky.min.js',
      './public/js/vendor/angular-bootstrap/ui-bootstrap.js',
      './public/js/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      './public/js/vendor/angular-bootstrap-contextmenu/contextMenu.js',
      './public/js/vendor/angular-file-upload/dist/angular-file-upload.min.js',
      './public/js/vendor/angular-bindonce/bindonce.min.js',
      './public/js/vendor/ngInfiniteScroll/build/ng-infinite-scroll.js',
      './public/js/vendor/smart-area/dist/smart-area.min.js',
      './public/js/vendor/angularjs-camelCase-human/camelcase-browser.js',
      './public/js/vendor/later/later.js',
      './public/js/vendor/HTML5-Desktop-Notifications2/desktop-notify.js',
      './public/js/vendor/angular-web-notification/angular-web-notification.js',
      './public/js/app.js',                                                       // Load app
      './public/js/appRoutes.js',                                                 // Load app routes
      './public/js/components/**/*.js',                                           // Load components
      './public/js/controllers/**/*.js',                                          // Load controllers
      './public/js/directives/*.js',                                              // Load directives
      './public/js/filters/**/*.js',                                              // Load filters
      './public/js/services/*.js',                                                // Load services
      './public/tests/**/*Spec.js'                                                // Load our test specs
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
