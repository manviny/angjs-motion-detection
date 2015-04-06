'use strict';

/**
 * @ngdoc overview
 * @name motionApp
 * @description
 * # motionApp
 *
 * Main module of the application.
 */
angular
  .module('motionApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/motion-detection', {
        templateUrl: 'views/motion-detection.html',
        controller: 'MotionDetectionCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
