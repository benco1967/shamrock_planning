angular.module('PlannerApp')
.controller('HomeCtrl', ['$scope', '$interval', function ($scope, $interval) {
  
  $scope.offsetPanorama = 1000;
  $scope.imgPanorama = 0;
  $scope.timerPanorama = null;
  
  function slidePanorama() {
    $scope.offsetPanorama -= 1;
    if($scope.offsetPanorama < 0) {
      $scope.offsetPanorama = 1000;
      $scope.imgPanorama = ($scope.imgPanorama + 1) % 2;
      $(".panorama>div").css("background-image",  'url("/img/panorama' + $scope.imgPanorama + '.jpg")');
    }
    $(".panorama>div").css("background-position", "" + $scope.offsetPanorama + "px 0px");
  }
  
  $scope.timerPanorama = $interval(slidePanorama, 40);
  
  $scope.$on('$destroy', function() {
    $interval.cancel($scope.timerPanorama);
  });
}]);


