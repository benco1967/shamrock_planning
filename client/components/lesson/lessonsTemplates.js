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
  function getDate(h) { 
    var t = new Date(0); 
    t.setHours(h); 
    return t; 
  }
  function newTemplate() {
    var tmp = {
      name: "Nouveau modèle",
      tags: [],
      creationDate: new Date(),
      startHour: getDate(8),
      endHour: getDate(20),
      step: getDate(1),
      state: "setHours"
    };
    resetHours(tmp);
    return tmp;
  }
  function hourToMilli(hour) {
    var regex = /(\d{2}):(\d{2}):\d/g;
    var tmp = regex.exec(hour);
    return tmp == null || tmp.length != 3 ? 0 : ((+tmp[1] * 60 + +tmp[2]) * 60000);
  }
  function resetHours(template) {
    
    template.plannings = { 
      times: [],
      instructors: {}
    };
    var value = template.startHour;
    var max = template.endHour;
    var inc = hourToMilli(template.step);
    if(inc == 0 || value > max) {
      template.plannings.times.push(new Date(value));
    }
    else {
      for(; value <= max; value = new Date(value.getTime() + inc)) {
        template.plannings.times.push(new Date(value));
      }
    }
    for(var i = 0; i < $scope.instructors.length; i++) {
      var planningFor = {
        instructor: $scope.instructors[i],
        lessons: []
      };
      for(var t = 0; t < template.plannings.times.length; t++) {
        planningFor.lessons.push({
          actived: true,
          horses: [],
          riders:[]
        });
      }
      
      template.plannings.instructors[$scope.instructors[i]._id] = planningFor;
    }
  }
  function toggleLesson(lesson, value) {
    lesson.actived = value == undefined ? !lesson.actived : value;
    if(!lesson.actived) {
      lesson.riders = [];
      lesson.horses = [];
    }
  }
  
  $scope.toggleLessons = function(lessons) {
    var value = true;
    for(var i = 0; i < lessons.length && value; i++) { 
      if(lessons[i].actived) value = false;
    }
    for(var i = 0; i < lessons.length; i++) { 
      toggleLesson(lessons[i], value);
    }
  }
  
  $scope.resetHours = resetHours;
  $scope.toggleLesson = toggleLesson;
  
  $scope.riderImgSize = 24;
  $scope.riders = $scope.$meteorCollection(Riders, false);
  $scope.instructors = $scope.$meteorCollection(Instructors, false);
  $scope.horses = $scope.$meteorCollection(Horses, false);
  for(var i = 0; i < $scope.horses.length; i++) {
    $scope.horses[i].nbLessons = 0;
  }
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
