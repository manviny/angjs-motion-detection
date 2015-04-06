'use strict';

/**
 * @ngdoc function
 * @name motionApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the motionApp
 */
angular.module('motionApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
