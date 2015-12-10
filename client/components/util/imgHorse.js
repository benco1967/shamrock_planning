angular.module('PlannerApp')

.directive('imgHorse', function() {
  return {
    restrict: 'E',
    require: "ngModel",
    scope: {
      name: '@',
      size: '@'
    },
    link: function (scope, elt, attrs, ctrl) {
      elt.find("img")[0].width = scope.size || 64;
      ctrl.$render = function() {
        elt.find("img")[0].src = ctrl.$modelValue ? ctrl.$modelValue : "/img/horseHead.png";
      };
    },
    templateUrl: 'client/components/util/imgHorse.html'
  };
});