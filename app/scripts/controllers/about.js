'use strict';

/**
 * @ngdoc function
 * @name motionApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the motionApp
 */
angular.module('motionApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
