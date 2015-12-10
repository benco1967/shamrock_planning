(function() {
  function handleDragStart(e) {
    this.style.opacity = '0.4';  // this / e.target is the source node.
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
    }

    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

    return false;
  }

  function handleDragEnter(e) {
    // this / e.target is the current hover target.
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');  // this / e.target is previous target element.
  }

  var cols = document.querySelectorAll('#columns .column');
  [].forEach.call(cols, function(col) {
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragenter', handleDragEnter, false);
    col.addEventListener('dragover', handleDragOver, false);
    col.addEventListener('dragleave', handleDragLeave, false);
  });
})();

angular.module('PlannerApp')
.controller('LessonsTemplatesCtrl', ['$scope', '$meteor', function ($scope, $meteor) {
  
  function newTemplate() {
    return {
      name: "Nouveau modèle",
      tags: [],
      creationDate: new Date()
    }
  }
  
  $scope.riderImgSize = 24;
  $scope.riders = $scope.$meteorCollection(Riders, false);
  $scope.instructorImgSize = 32;
  $scope.instructors = $scope.$meteorCollection(Instructors, false);
  $scope.nbSlots = [0, 1, 2, 3, 4, 5, 6 ,7 ,8, 9 , 10, 11];
  $scope.horseImgSize = 24;
  $scope.horses = $scope.$meteorCollection(Horses, false);
  $scope.template = newTemplate();
  $scope.templates = $scope.$meteorCollection(LessonsTemplates, false);
  $scope.resetNew = function() {
    $scope.template = newTemplate();
  };  
  $scope.create = function() {
    $scope.template.creationDate = new Date();
    LessonsTemplates.insert($scope.template);
  }; 
  $scope.duplicate = function() {
    var tmp = angular.copy(this.template);
    delete tmp._id;
  }; 
  $scope.remove = function() {
    LessonsTemplates.remove(this.template._id);
  };
  $scope.edit = function() {
    this.templateCopy = angular.copy(this.template);
  };
  $scope.save = function() {
    var set = {
          name: this.template.name
        };
    LessonsTemplates.update(this.template._id, {$set:set});
  }; 
  $scope.cancelSave = function() {
    angular.copy(this.templateCopy, this.template);
  };
}]);
