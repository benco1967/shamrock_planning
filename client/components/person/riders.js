
angular.module('PlannerApp')
.controller('RidersCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
  
  function newRider() {
    return {
      name: "",
      image: null,
      gender: "female",
      creationDate: new Date()
    }
  }
  $scope.rider = null;
  $scope.riders = $scope.$meteorCollection(Riders, false);
  $scope.resetNew = function() {
    $scope.rider = newRider();
  };  
  $scope.create = function() {
    $scope.rider.creationDate = new Date();
    Riders.insert($scope.rider);
  };  
  $scope.remove = function() {
    Riders.remove(this.rider._id);
  };
  $scope.edit = function() {
    this.riderCopy = angular.copy(this.rider);
  };
  $scope.save = function() {
    var set = {
          name: this.rider.name,
          image: this.rider.image,
          gender: this.rider.gender
        };
    Riders.update(this.rider._id, {$set:set});
  };
  $scope.cancelSave = function() {
    angular.copy(this.riderCopy, this.rider);
  };
}]);
