angular.module('PlannerApp')
/***
*    8b    d8 88 8b    d8 888888     888888 Yb  dP 88""Yb 888888 
*    88b  d88 88 88b  d88 88__         88    YbdP  88__dP 88__   
*    88YbdP88 88 88YbdP88 88""         88     8P   88"""  88""   
*    88 YY 88 88 88 YY 88 888888       88    dP    88     888888 
*/
.factory('mimeType', [function() {
  function replaceFn(match, p1, p2, p3){
    return p1 + "_" + p2.toLowerCase() + p3;
  }
  function isA(types, mimeType) {
    for (var i = 0; i < types.length; i++) {
      if (types[i] == mimeType) {
        return true;
      }
    }
    return false;
  }
  function mimeTypeFromId(id) {
    var result = id;
    do {
      id = result;
      result = id.replace(/([0-9a-z]*)([A-Z])(.*)/, replaceFn);
    } while(result != id);
    return "application/horses.planner." + result;
  }
  return {
    fromId: mimeTypeFromId,
    isA: isA,
    isAHorse: function(types) { return isA(types, "application/horses.planner.horse"); },
    isARider: function(types) { return isA(types, "application/horses.planner.rider"); },
    has: function(types, collection) {
      for(var i = 0; i < collection.length; i++) {
        var _id = collection[i];
        if(isA(types, mimeTypeFromId(_id))) return _id;
      }
      return false;
    }
  };
}])
/***
*    88""Yb 88        db    88b 88 88b 88 888888 88""Yb      dP""b8 88""Yb 888888    db    888888  dP"Yb  88""Yb 
*    88__dP 88       dPYb   88Yb88 88Yb88 88__   88__dP     dP   `" 88__dP 88__     dPYb     88   dP   Yb 88__dP 
*    88"""  88  .o  dP__Yb  88 Y88 88 Y88 88""   88"Yb      Yb      88"Yb  88""    dP__Yb    88   Yb   dP 88"Yb  
*    88     88ood8 dP""""Yb 88  Y8 88  Y8 888888 88  Yb      YboodP 88  Yb 888888 dP""""Yb   88    YbodP  88  Yb 
*
* Planner creator
* planner is the object that allows to create the planning
*/
.factory('plannerCreator', ['$sce', '$log', 'mimeType', function($sce, $log, mimeType) {
  
  function hourToMilli(hour) {
    var regex = /(\d{2}):(\d{2}):\d/g;
    var tmp = regex.exec(hour);
    return tmp == null || tmp.length != 3 ? 0 : ((+tmp[1] * 60 + +tmp[2]) * 60000);
  }
  
  function getDate(h) { 
    var t = new Date(0); 
    t.setHours(h); 
    return t; 
  }
   
  function drop(planner, id, lesson, attr) {
    if(!id) return;
    planner.hoursEditable = false;
    var timesAttrs = planner.times[lesson.index][attr];
    if(timesAttrs.indexOf(id) != - 1) return;
    // update attr in times
    timesAttrs.push(id);
    // update attr itself
    var obj = planner[attr][id];
    obj.nbLessons++;
    obj.lessons[lesson.index] = lesson;
    // update attr in lesson
    lesson[attr].push(id);
    // refresh display
    planner.scope.$digest();
  };
  
  function Planner(scope) {
    var riders = scope.$meteorCollection(Riders, false);
    var instructors = scope.$meteorCollection(Instructors, false);
    var horses = scope.$meteorCollection(Horses, false);
    this.hoursEditable = true;
    this.scope = scope;
    this.name = "Nouveau planning";
    this.riders = {};
    for(var i = 0; i < riders.length; i++) {
      var rider = angular.copy(riders[i]);
      rider.nbLessons = 0;
      rider.lessons = {};
      this.riders[rider._id] = rider;
    }
    this.horses = {};
    for(var i = 0; i < horses.length; i++) {
      var horse = angular.copy(horses[i]);
      horse.nbLessons = 0;
      horse.lessons = {};
      this.horses[horse._id] = horse;
    }
    
    this.plannings = {};
    for(var i = 0; i < instructors.length; i++) {
      var instructor = angular.copy(instructors[i]);
      this.plannings[instructor._id] = {
        instructor: instructor,
        lessons: []
      };
    }
    
    this.startHour = getDate(8);
    this.endHour = getDate(20);
    this.step = getDate(1);
  }
  Planner.prototype.setContent = function(lessonsTemplate) {
    // reset plannings
    for(var id in this.plannings) {
      var planningFor = this.plannings[id];
      planningFor.lessons = [];
      for(var t = 0; t < this.times.length; t++) {
        if(true) {
          planningFor.lessons.push({
            actived: true,
            index: t,
            instructor: id,
            horses: [],
            riders:[]
          });
        }
        else {
          planningFor.lessons.push({
            actived: true,
            index: t,
            instructor: id,
            horses: [],
            riders:[]
          });
        }
      }
    }
    // reset montoir
    for(var id in this.horses) {
      var horse = this.horses[id];
      horse.nbLessons = 0;
      horse.lessons = {};
    }
    for(var id in this.riders) {
      var rider = this.riders[id];
      rider.nbLessons = 0;
      rider.lessons = {};
    }
  }
  Planner.prototype.setHours = function() {
    // Reset hours
    this.times = [];
    var value = this.startHour;
    var max = this.endHour;
    var inc = hourToMilli(this.step);
    if(inc == 0 || value > max) {
      this.times.push({
        hour: new Date(value),
        horses: [],
        riders:[]
      });
    }
    else {
      for(; value <= max; value = new Date(value.getTime() + inc)) {
        this.times.push({
          hour: new Date(value),
          horses: [],
          riders:[]
        });
      }
    }
    // reset plannings
    for(var id in this.plannings) {
      var planningFor = this.plannings[id];
      planningFor.lessons = [];
      for(var t = 0; t < this.times.length; t++) {
        planningFor.lessons.push({
          actived: true,
          index: t,
          instructor: id,
          horses: [],
          riders:[]
        });
      }
    }
    // reset montoir
    for(var id in this.horses) {
      var horse = this.horses[id];
      horse.nbLessons = 0;
      horse.lessons = {};
    }
    for(var id in this.riders) {
      var rider = this.riders[id];
      rider.nbLessons = 0;
      rider.lessons = {};
    }
  };
  
  Planner.prototype.overAccessHorse = function(types, index) {
    if(mimeType.isAHorse(types) === false) return false;
    if(mimeType.has(types, this.times[index].horses) !== false) return 0;
    if(index + 1 < this.times.length) {
      if(mimeType.has(types, this.times[index + 1].horses) !== false) return 1;
    }
    if(index - 1 >= 0) {
      if(mimeType.has(types, this.times[index - 1].horses) !== false) return 1;
    }
    if(index + 2 < this.times.length) {
      if(mimeType.has(types, this.times[index + 2].horses) !== false) return 2;
    }
    if(index - 2 >= 0) {
      if(mimeType.has(types, this.times[index - 2].horses) !== false) return 2;
    }
    return true;
  };
  Planner.prototype.overClassHorse = function(types, index) {
    var access = this.overAccessHorse(types, index);
    switch(access) {
      case true: return 'over-ok';
      case 0: return 'over-forbidden';
      case 1: return 'over-alert';
      case 2: return 'over-warning';
      case false: return false;
    }
  }  

  Planner.prototype.dropHorse = function(id, lesson) {
    drop(this, id, lesson, "horses");
  };
  
  Planner.prototype.overAccessRider = function(types, index) {
    if(mimeType.isARider(types) === false) return false;
    if(mimeType.has(types, this.times[index].riders) !== false) return 0;
    return true;
  };
  Planner.prototype.overClassRider = function(types, index) {
    var access = this.overAccessRider(types, index, false);
    switch(access) {
      case true: return 'over-ok';
      case 0: return 'over-forbidden';
      case false: return false;
    }
  };
  Planner.prototype.dropRider = function(id, lesson) {
    drop(this, id, lesson, "riders");
  };
  
  Planner.prototype.removeObjectFromLesson = function(attr, object, lesson) {
    // suppress the lesson in the obect
    object.nbLessons--;
    delete object.lessons[lesson.index];
    // suppress the object in the lesson
    var objects = lesson[attr];
    var index = objects.indexOf(object._id);
    lesson[attr].splice(index, 1);
    // suppress the object in the times
    var time = this.times[lesson.index];
    var objects = time[attr];
    var index = objects.indexOf(object._id);
    time[attr].splice(index, 1);
  };
  Planner.prototype.removeFromObject = function(attr, lesson, object) {
    // suppress the lesson in the obect
    object.nbLessons--;
    delete object.lessons[lesson.index];
    // suppress the object in the lesson
    var objects = lesson[attr];
    var index = objects.indexOf(object._id);
    lesson[attr].splice(index, 1);
    // suppress the object in the times
    var time = this.times[lesson.index];
    var objects = time[attr];
    var index = objects.indexOf(object._id);
    time[attr].splice(index, 1);
  };
  
  Planner.prototype.toggleLesson = function(lesson, value) {
    this.hoursEditable = false;
    lesson.actived = value == undefined ? !lesson.actived : value;
    if(!lesson.actived) {
      var hour = this.times[lesson.index];
      for(var i = 0; i < lesson.horses.length; i++) {
        var horseId = lesson.horses[i];
        var horse = this.horses[horseId];
        if(horse) {
          horse.nbLessons--;
          delete horse.lessons[lesson.index];
        }
        var index = hour.horses.indexOf(horseId);
        if(index != -1) hour.horses.splice(index, 1);
      }
      for(var i = 0; i < lesson.riders.length; i++) {
        var riderId = lesson.riders[i];
        var rider = this.riders[riderId];
        if(rider) {
          rider.nbLessons--;
          delete rider.lessons[lesson.index];
        }
        var index = hour.riders.indexOf(riderId);
        if(index != -1) hour.riders.splice(index, 1);
      }
      lesson.riders = [];
      lesson.horses = [];
    }
  };
  Planner.prototype.toggleLessons = function(lessons) {
    var value = true;
    for(var i = 0; i < lessons.length && value; i++) { 
      if(lessons[i].actived) value = false;
    }
    for(var i = 0; i < lessons.length; i++) { 
      this.toggleLesson(lessons[i], value);
    }
  };
  Planner.prototype.getTemplate = function() {
    result = {
      name: this.name,
      creationDate: new Date(),
      lessons: {},
      times:[]
    };
    for(var t = 0; t < this.times.length; t++) {
      result.times.push({ hour: angular.copy(this.times[t]) });
    } 
    for(var id in this.plannings) {
      result.lessons[id] = [];
      var planningFor = this.plannings[id];
      for(var t = 0; t < this.times.length; t++) {
        var planning = planningFor.lessons[t];
        if(planning.actived) {
          result.lessons[id].push({
            index: planning.index, 
            horses: planning.horses,
            riders: planning.riders
          });
        }
      }
    }

    $log.info("nouveau template " + JSON.stringify(result));
    return result;
  }
  var create = function create(scope) {
    var planner = new Planner(scope);
    planner.setHours();
    return planner;
  }
  create.formTemplate = function(scope, lessonsTemplate) {
    var planner = new Planner(scope);
    planner.setContent(lessonsTemplate);
    return planner;
  }
  return create;
}])

/****************************************************************************
*
*     dP"Yb  88""Yb  88888 888888  dP""b8 888888  .o. .dP"Y8     88     888888 .dP"Y8 .dP"Y8  dP"Yb  88b 88 .dP"Y8     888888 8888b.  88 888888  dP"Yb  88""Yb 
*    dP   Yb 88__dP     88 88__   dP   `"   88   ,dP' `Ybo."     88     88__   `Ybo." `Ybo." dP   Yb 88Yb88 `Ybo."     88__    8I  Yb 88   88   dP   Yb 88__dP 
*    Yb   dP 88""Yb o.  88 88""   Yb        88        o.`Y8b     88  .o 88""   o.`Y8b o.`Y8b Yb   dP 88 Y88 o.`Y8b     88""    8I  dY 88   88   Yb   dP 88"Yb  
*     YbodP  88oodP "bodP' 888888  YboodP   88        8bodP'     88ood8 888888 8bodP' 8bodP'  YbodP  88  Y8 8bodP'     888888 8888Y"  88   88    YbodP  88  Yb 
*
* Modal controller to edit the object's lessons
*/
.controller('ModalEditLessonsCtrl', ['$scope', '$modalInstance', 'object', 'planner', function ($scope, $modalInstance, object, planner) {
  $scope.name = object.name;
  $scope.image = object.image;
  $scope.gender = object.gender;
  $scope.lessons = [];
  var lessons = object.lessons;
  for(i in lessons) {
    var lesson = lessons[i];
    var instructor = planner.plannings[lesson.instructor].instructor;
    $scope.lessons.push({
      name: instructor.name,
      image: instructor.image,
      gender: instructor.gender,
      hour: planner.times[i].hour,
      lesson: lesson,
      selected: false
    });
  }

  $scope.ok = function () {
    var selectedLessons = [];
    for(var i = 0; i < $scope.lessons.length; i++) {
      if($scope.lessons[i].selected) {
        selectedLessons.push($scope.lessons[i].lesson);
      }
    }
    $modalInstance.close(selectedLessons);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}])
/***************************************************************************************
*
*    88     888888 .dP"Y8 .dP"Y8  dP"Yb  88b 88  .o. .dP"Y8      dP"Yb  88""Yb  88888 888888  dP""b8 888888 .dP"Y8     888888 8888b.  88 888888  dP"Yb  88""Yb 
*    88     88__   `Ybo." `Ybo." dP   Yb 88Yb88 ,dP' `Ybo."     dP   Yb 88__dP     88 88__   dP   `"   88   `Ybo."     88__    8I  Yb 88   88   dP   Yb 88__dP 
*    88  .o 88""   o.`Y8b o.`Y8b Yb   dP 88 Y88      o.`Y8b     Yb   dP 88""Yb o.  88 88""   Yb        88   o.`Y8b     88""    8I  dY 88   88   Yb   dP 88"Yb  
*    88ood8 888888 8bodP' 8bodP'  YbodP  88  Y8      8bodP'      YbodP  88oodP "bodP' 888888  YboodP   88   8bodP'     888888 8888Y"  88   88    YbodP  88  Yb 
*
* Modal controller to edit the lesson's objects
*/
.controller('ModalEditLessonCtrl', ['$scope', '$modalInstance', 'lesson', 'planner', function ($scope, $modalInstance, lesson, planner) {
  var instructor = planner.plannings[lesson.instructor].instructor;
  $scope.name = instructor.name;
  $scope.image = instructor.image;
  $scope.gender = instructor.gender;
  $scope.hour = planner.times[lesson.index].hour;
  function setObjects(attr) {
    $scope[attr] = [];
    for(var i = 0; i < lesson[attr].length; i++) {
      var object = planner[attr][lesson[attr][i]];
      $scope[attr].push({
        name: object.name,
        image: object.image,
        gender: object.gender,
        _id: object._id,
        selected: false
      });
    }
  }
  setObjects('riders');
  setObjects('horses');
  
  $scope.ok = function () {
    function getObjects(attr) {
      var selectedObjects = [];
      for(var i = 0; i < $scope[attr].length; i++) {
        if($scope[attr][i].selected) {
          selectedObjects.push($scope[attr][i]._id);
        }
      }
      return selectedObjects;
    }
    $modalInstance.close({riders: getObjects('riders'), horses: getObjects('horses')});
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}])
/**************************************************************************************************
 *
 *    88     888888 .dP"Y8 .dP"Y8  dP"Yb  88b 88  .o. .dP"Y8     888888 8888b.  88 888888  dP"Yb  88""Yb      dP"Yb  888888     888888 888888 8b    d8 88""Yb 88        db    888888 888888 
 *    88     88__   `Ybo." `Ybo." dP   Yb 88Yb88 ,dP' `Ybo."     88__    8I  Yb 88   88   dP   Yb 88__dP     dP   Yb 88__         88   88__   88b  d88 88__dP 88       dPYb     88   88__   
 *    88  .o 88""   o.`Y8b o.`Y8b Yb   dP 88 Y88      o.`Y8b     88""    8I  dY 88   88   Yb   dP 88"Yb      Yb   dP 88""         88   88""   88YbdP88 88"""  88  .o  dP__Yb    88   88""   
 *    88ood8 888888 8bodP' 8bodP'  YbodP  88  Y8      8bodP'     888888 8888Y"  88   88    YbodP  88  Yb      YbodP  88           88   888888 88 YY 88 88     88ood8 dP""""Yb   88   888888 
 */
.controller('ModalEditLessonContentCtrl', ['$scope', '$modalInstance', 'lesson', 'instructor', function ($scope, $modalInstance, lesson, instructor) {
  $scope.name = instructor.name;
  $scope.image = instructor.image;
  $scope.gender = instructor.gender;
  $scope.hour = lesson.hour;
  var objects = {
    riders: Riders,
    horses: Horses
  };
  function setObjects(attr) {
    $scope[attr] = [];
    for(var i = 0; i < lesson[attr].length; i++) {
      var object = objects[attr].findOne({_id: lesson[attr][i]});
      $scope[attr].push({
        name: object.name,
        image: object.image,
        gender: object.gender,
        _id: object._id,
        selected: false
      });
    }
  }
  setObjects('riders');
  setObjects('horses');
  
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}])
/*************************************************************************************************************************
 *
 *888888 888888 8b    d8 88""Yb 88        db    888888 888888     88     888888 .dP"Y8 .dP"Y8  dP"Yb  88b 88      dP""b8  dP"Yb  88b 88 888888 88""Yb  dP"Yb  88     88     888888 88""Yb 
 *  88   88__   88b  d88 88__dP 88       dPYb     88   88__       88     88__   `Ybo." `Ybo." dP   Yb 88Yb88     dP   `" dP   Yb 88Yb88   88   88__dP dP   Yb 88     88     88__   88__dP 
 *  88   88""   88YbdP88 88"""  88  .o  dP__Yb    88   88""       88  .o 88""   o.`Y8b o.`Y8b Yb   dP 88 Y88     Yb      Yb   dP 88 Y88   88   88"Yb  Yb   dP 88  .o 88  .o 88""   88"Yb  
 *  88   888888 88 YY 88 88     88ood8 dP""""Yb   88   888888     88ood8 888888 8bodP' 8bodP'  YbodP  88  Y8      YboodP  YbodP  88  Y8   88   88  Yb  YbodP  88ood8 88ood8 888888 88  Yb 
 *
 * Controller of the template lesson
 */
.controller('LessonsTemplatesCtrl', ['$scope', '$modal', 'plannerCreator', function ($scope, $modal, plannerCreator) {
  function newPlanner() {
    return plannerCreator($scope);
  }
  $scope.overId = null;
  $scope.planner = newPlanner();
  $scope.templates = $scope.$meteorCollection(LessonsTemplates, false);
  $scope.setOver = function(object) {
    for(var i in object.lessons) {
      object.lessons[i].isOver = true;
    }
  }; 
  $scope.setLeave = function(object) {
    for(var i in object.lessons) {
      object.lessons[i].isOver = false;
    }
  };
  
  $scope.editLessons = function(planner, attr, object) {
    var self = planner;
    var tmp = object;
    var modalInstance = $modal.open({
      templateUrl: attr == 'horses' ? 'client/components/lesson/modalHorseEditLessons.html' : 'client/components/lesson/modalRiderEditLessons.html',
      controller: 'ModalEditLessonsCtrl',
      size: 'sm',
      resolve: {
        object: function() {
          return tmp;
        },
        planner: function () {
          return self;
        }
      }
    });

    modalInstance.result.then(function(lessonsToRemove) {
      for(var i = 0; i < lessonsToRemove.length; i++) {
        self.removeObjectFromLesson(attr, object, lessonsToRemove[i]);
      }
    });
  }
  $scope.editLesson = function(planner, lesson) {
    var self = planner;
    var tmp = lesson;
    if(lesson.riders.length === 0 && lesson.horses.length === 0) return;
    var modalInstance = $modal.open({
      templateUrl: 'client/components/lesson/modalEditLesson.html',
      controller: 'ModalEditLessonCtrl',
      resolve: {
        lesson: function() {
          return tmp;
        },
        planner: function () {
          return self;
        }
      }
    });

    modalInstance.result.then(function(objectsToRemove) {
      function remove(attr) {
        for(var i = 0; i < objectsToRemove[attr].length; i++) {
          var object = self[attr][objectsToRemove[attr][i]];
          self.removeObjectFromLesson(attr, object, tmp);
        }
      }
      remove('riders');
      remove('horses');
    });
  }
  
  $scope.editLessonContent = function(instructor_id, lesson) {
    var instructor = Instructors.findOne({ _id: instructor_id });
    var tmp = lesson;
    var modalInstance = $modal.open({
      templateUrl: 'client/components/lesson/modalEditLessonContent.html',
      controller: 'ModalEditLessonContentCtrl',
      resolve: {
        lesson: function() {
          return tmp;
        },
        instructor: function () {
          return instructor;
        }
      }
    });

    modalInstance.result.then(function() {
    });
  }
  
  $scope.resetNew = function() {
    $scope.planner = newPlanner();
  };  
  $scope.create = function() {
    var template = $scope.planner.getTemplate();
    LessonsTemplates.insert(template);
  }; 
  $scope.duplicate = function() {
    var tmp = angular.copy(this.template);
    delete tmp._id;
    tmp.creationDate = new Date();
    tmp.name = tmp.name + " copie";
    return LessonsTemplates.insert(tmp);
  }; 
  $scope.remove = function() {
    LessonsTemplates.remove(this.template._id);
  };
  $scope.edit = function() {
    this.templateCopy = angular.copy(this.template);
    $scope.planner = plannerCreator.formTemplate($scope, this.template);
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
}])
/************************************************************************
*
*    8888b.  88""Yb    db     dP""b8  dP""b8    db    88""Yb 88     888888 88""Yb 88 8888b.  888888 88""Yb 
*     8I  Yb 88__dP   dPYb   dP   `" dP   `"   dPYb   88__dP 88     88__   88__dP 88  8I  Yb 88__   88__dP 
*     8I  dY 88"Yb   dP__Yb  Yb  "88 Yb  "88  dP__Yb  88""Yb 88  .o 88""   88"Yb  88  8I  dY 88""   88"Yb  
*    8888Y"  88  Yb dP""""Yb  YboodP  YboodP dP""""Yb 88oodP 88ood8 888888 88  Yb 88 8888Y"  888888 88  Yb 
*
*/
.directive('draggableRider', ["mimeType", function(mimeType) {
  function getRiderTxt(_id) {
    var rider = Riders.findOne({ _id: _id });
    return JSON.stringify({_id: rider._id, name: rider.name, creationDate: rider.creationDate});
  }
  return function(scope, element, attrs) {
    // this gives us the native JS object
    var el = element[0];

    el.draggable = true;

    el.addEventListener(
        'dragstart',
        function(e) {
            e.dataTransfer.effectAllowed = 'copy';
            var _id = attrs.draggableRider;
            e.dataTransfer.setData('application/horses.planner.rider', _id);
            e.dataTransfer.setData(mimeType.fromId(_id), _id);
            e.dataTransfer.setData('Text', getRiderTxt(_id));
            this.classList.add('drag');
            return false;
        },
        false
    );

    el.addEventListener(
        'dragend',
        function(e) {
            this.classList.remove('drag');
            return false;
        },
        false
    );
  }
}])
/*************************************************************************************
*
*    8888b.  88""Yb    db     dP""b8  dP""b8    db    88""Yb 88     888888 88  88  dP"Yb  88""Yb .dP"Y8 888888 
*     8I  Yb 88__dP   dPYb   dP   `" dP   `"   dPYb   88__dP 88     88__   88  88 dP   Yb 88__dP `Ybo." 88__   
*     8I  dY 88"Yb   dP__Yb  Yb  "88 Yb  "88  dP__Yb  88""Yb 88  .o 88""   888888 Yb   dP 88"Yb  o.`Y8b 88""   
*    8888Y"  88  Yb dP""""Yb  YboodP  YboodP dP""""Yb 88oodP 88ood8 888888 88  88  YbodP  88  Yb 8bodP' 888888 
*
*/
.directive('draggableHorse', ["mimeType", function(mimeType) {
  function getHorseTxt(_id) {
    var horse = Horses.findOne({ _id: _id });
    return JSON.stringify({_id: horse._id, name: horse.name, creationDate: horse.creationDate});
  }
  return function(scope, element, attrs) {
    // this gives us the native JS object
    var el = element[0];

    el.draggable = true;

    el.addEventListener(
        'dragstart',
        function(e) {
            e.dataTransfer.effectAllowed = 'copy';
            var _id = attrs.draggableHorse;
            e.dataTransfer.setData('application/horses.planner.horse', _id);
            e.dataTransfer.setData(mimeType.fromId(_id), _id);
            e.dataTransfer.setData('Text', getHorseTxt(_id));
            this.classList.add('drag');
            return false;
        },
        false
    );

    el.addEventListener(
        'dragend',
        function(e) {
            this.classList.remove('drag');
            return false;
        },
        false
    );
  }
}])
/*****************************************************************************************
*
*    8888b.  88""Yb  dP"Yb  88""Yb 88""Yb    db    88""Yb 88     888888 88  88  dP"Yb  88""Yb .dP"Y8 888888    db    88b 88 8888b.  88""Yb 88 8888b.  888888 88""Yb 
*     8I  Yb 88__dP dP   Yb 88__dP 88__dP   dPYb   88__dP 88     88__   88  88 dP   Yb 88__dP `Ybo." 88__     dPYb   88Yb88  8I  Yb 88__dP 88  8I  Yb 88__   88__dP 
*     8I  dY 88"Yb  Yb   dP 88"""  88"""   dP__Yb  88""Yb 88  .o 88""   888888 Yb   dP 88"Yb  o.`Y8b 88""    dP__Yb  88 Y88  8I  dY 88"Yb  88  8I  dY 88""   88"Yb  
*    8888Y"  88  Yb  YbodP  88     88     dP""""Yb 88oodP 88ood8 888888 88  88  YbodP  88  Yb 8bodP' 888888 dP""""Yb 88  Y8 8888Y"  88  Yb 88 8888Y"  888888 88  Yb 
*/
.directive('droppableHorseAndRider', ["mimeType", function(mimeType) {
  function setOverClass(el, e, scope) {
    var overClass = scope.planner.overClassHorse(e.dataTransfer.types, scope.lesson.index);
    if(overClass !== false) {
      el.classList.add(overClass);
      return;
    }
    
    var overClass = scope.planner.overClassRider(e.dataTransfer.types, scope.lesson.index);
    if(overClass !== false) {
      el.classList.add(overClass);
    }  
  }
  function resetOverClass(el) {
    el.classList.remove('over-ok');
    el.classList.remove('over-forbidden');
    el.classList.remove('over-alert');
    el.classList.remove('over-warning');
  }
  return {
    scope: {
      planner: "=",
      lesson: "="
    },
    link: function(scope, element) {
      // again we need the native object
      var el = element[0];
      
      el.addEventListener(
        'dragover',
        function(e) {
          e.dataTransfer.dropEffect = 'copy'; 
          // allows us to drop
          if (e.preventDefault) e.preventDefault();
          setOverClass(this, e, scope);
          return false;
        },
        false
      );
      
      el.addEventListener(
        'dragenter',
        function(e) {
          setOverClass(this, e, scope);
          return false;
        },
        false
      );

      el.addEventListener(
        'dragleave',
        function(e) {
          resetOverClass(this);
          return false;
        },
        false
      );
      
      el.addEventListener(
        'drop',
        function(e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) e.stopPropagation();

          resetOverClass(this);
          scope.planner.dropHorse(e.dataTransfer.getData('application/horses.planner.horse'), scope.lesson);
          scope.planner.dropRider(e.dataTransfer.getData('application/horses.planner.rider'), scope.lesson);
          return false;
        },
        false
      );
    }
  }
}]);
