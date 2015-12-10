angular.module('PlannerApp')

.directive('imgCircle', function() {
  return {
    restrict: 'E',
    require: "ngModel",
    scope: {
      name: '@',
      size: '@',
      srcDefault: '='
    },
    link: function (scope, elt, attrs, ctrl) {
      elt.find("img")[0].width = scope.size || 64;
      ctrl.$render = function() {
        elt.find("img")[0].src = ctrl.$modelValue ? ctrl.$modelValue : scope.srcDefault;
      };
      scope.$watch(function() { return scope.srcDefault; }, ctrl.$render);
    },
    templateUrl: 'client/components/util/imgCircle.html'
  };
});