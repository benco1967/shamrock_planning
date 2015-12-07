
angular.module('PlannerApp')
.controller('HorsesCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
  
  function newHorse() {
    return {
      name: "",
      image: null,
      creationDate: new Date()
    }
  }
  $scope.horse = null;
  $scope.horses = $scope.$meteorCollection(Horses, false);
  $scope.instructors = $scope.$meteorCollection(Instructors, false);
  $scope.resetNew = function() {
    $scope.horse = newHorse();
  };  
  $scope.create = function() {
    $scope.horse.creationDate = new Date();
    Horses.insert($scope.horse);
  };  
  $scope.remove = function() {
    Horses.remove(this.horse._id);
  };
  $scope.edit = function() {
    this.horseCopy = angular.copy(this.horse);
  };
  $scope.save = function() {
    var set = {
          name: this.horse.name,
          image: this.horse.image
        };
    Horses.update(this.horse._id, {$set:set});
  };
  $scope.cancelSave = function() {
    angular.copy(this.horseCopy, this.horse);
  };
}]);