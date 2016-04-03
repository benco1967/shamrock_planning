angular.module('PlannerApp')

.directive('imgPerson', function() {
  return {
    restrict: 'E',
    scope: {
      image: '@',
      name: '@',
      size: '@',
      gender: '@'
    },
    link: function (scope, elt, attrs, ctrl) {
      function getDefaultImage(gender) {
        return gender === "male" ? "/img/manHead.png" : "/img/womanHead.png";
      }
      elt.find("img")[0].width = scope.size || 64;
      function render() {
        elt.find("img")[0].src = scope.image ? scope.image : getDefaultImage(scope.gender);
      };
      scope.$watch(function() { return scope.gender; }, render);
      scope.$watch(function() { return scope.image; }, render);
      render();
    },
    templateUrl: 'client/components/util/imgPerson.html'
  };
});