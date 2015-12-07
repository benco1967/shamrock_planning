
angular.module('PlannerApp')
.controller('LessonsCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
  
  function newLesson() {
    return {
      day: "saturday",
      hour: "10:00",
      instructor_id: null,
      creationDate: new Date()
    }
  }
  $scope.lesson = newLesson();
  $scope.lessons = $scope.$meteorCollection(Lessons, false);
  $scope.instructors = $scope.$meteorCollection(Instructors, false);
  $scope.resetNew = function() {
    $scope.lesson = newLesson();
  };  
  $scope.create = function() {
    $scope.lesson.creationDate = new Date();
    Lessons.insert($scope.lesson);
  }; 
  $scope.remove = function() {
    Lessons.remove(this.lesson._id);
  };
  $scope.edit = function() {
    this.lessonCopy = angular.copy(this.lesson);
  };
  $scope.save = function() {
    var set = {
          day: this.lesson.day,
          hour: this.lesson.hour,
          instructor_id: this.lesson.instructor_id
        };
    Lessons.update(this.lesson._id, {$set:set});
  }; 
  $scope.cancelSave = function() {
    angular.copy(this.lessonCopy, this.lesson);
  };
}]);