angular.module('PlannerApp')

.directive('imgCircle', function() {
  return {
    restrict: 'E',
    require: "ngModel",
    scope: {
      name: '@',
      srcDefault: '='
    },
    link: function (scope, elt, attrs, ctrl) {
      ctrl.$render = function() {
        elt.find("img")[0].src = ctrl.$modelValue ? ctrl.$modelValue : scope.srcDefault;
      };
      scope.$watch(function() { return scope.srcDefault; }, ctrl.$render);
    },
    templateUrl: 'client/components/util/imgCircle.html'
  };
});