angular.module('PlannerApp')

.directive('imgHorse', function() {
  return {
    restrict: 'E',
    scope: {
      image: '@',
      name: '@',
      size: '@'
    },
    link: function (scope, elt, attrs, ctrl) {
      elt.find("img")[0].width = scope.size || 64;
      function render() {
        elt.find("img")[0].src = scope.image ? scope.image : "/img/horseHead.png";
      };
      scope.$watch(function() { return scope.image; }, render);
      render();
    },
    templateUrl: 'client/components/util/imgHorse.html'
  };
});