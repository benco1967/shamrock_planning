
angular.module('PlannerApp')
.controller('InstructorsCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
  
  function newInstructor() {
    return {
      name: "",
      image: null,
      gender: "female",
      creationDate: new Date()
    }
  }
  $scope.getDefaultImage = function(gender) {
    return gender === "male" ? "/img/manHead.png" : "/img/womanHead.png";
  }
  $scope.instructor = null;
  $scope.instructors = $scope.$meteorCollection(Instructors, false);
  $scope.resetNew = function() {
    $scope.instructor = newInstructor();
  };  
  $scope.create = function() {
    $scope.instructor.creationDate = new Date();
    Instructors.insert($scope.instructor);
  };  
  $scope.remove = function() {
    Instructors.remove(this.instructor._id);
  };
  $scope.edit = function() {
    this.instructorCopy = angular.copy(this.instructor);
  };
  $scope.save = function() {
    var set = {
          name: this.instructor.name,
          image: this.instructor.image,
          gender: this.instructor.gender
        };
    Instructors.update(this.instructor._id, {$set:set});
  };
  $scope.cancelSave = function() {
    angular.copy(this.instructorCopy, this.instructor);
  };
}]);
