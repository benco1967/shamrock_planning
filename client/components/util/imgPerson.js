angular.module('PlannerApp')

.directive('imgPerson', function() {
  return {
    restrict: 'E',
    require: "ngModel",
    scope: {
      name: '@',
      size: '@',
      gender: '='
    },
    link: function (scope, elt, attrs, ctrl) {
      getDefaultImage = function(gender) {
        return gender === "male" ? "/img/manHead.png" : "/img/womanHead.png";
      }
      elt.find("img")[0].width = scope.size || 64;
      ctrl.$render = function() {
        elt.find("img")[0].src = ctrl.$modelValue ? ctrl.$modelValue : getDefaultImage(scope.gender);
      };
      scope.$watch(function() { return scope.gender; }, ctrl.$render);
    },
    templateUrl: 'client/components/util/imgPerson.html'
  };
});