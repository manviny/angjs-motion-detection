'use strict';

describe('Controller: MotionDetectionCtrl', function () {

  // load the controller's module
  beforeEach(module('motionApp'));

  var MotionDetectionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MotionDetectionCtrl = $controller('MotionDetectionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
