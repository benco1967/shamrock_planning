angular.module('PlannerApp')

.directive('genderInput', ['$q', function($q) {

  return {
    restrict: 'E',
    require: "ngModel",
    scope: {
      name: '@'
    },
    controller: function($scope) {
      if(!$scope.name) $scope.name = "gender";
      
      $scope.change = function(newValue) {
        $scope.isMale = newValue;
        $scope._ctrl.$setViewValue($scope.isMale ? 'male': 'female');
      };
    },
    link: function (scope, elt, attrs, ctrl) {
      scope._ctrl = ctrl;
      ctrl.$render = function() {
        scope.isMale = ctrl.$modelValue === "male";
      };

    },
    templateUrl: 'client/components/util/genderInput.html'
  };
}]);