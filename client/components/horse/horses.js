
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
}])
.directive('droppableHorsesName', ["mimeType", "$log", function(mimeType, $log) {
  function setOverClass(el, e, scope) {
    if(e.dataTransfer.types == "text/plain") {
      el.classList.add('over-ok');
    }
  }
  function resetOverClass(el) {
    el.classList.remove('over-ok');
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
          var data = e.dataTransfer.getData('text/plain').split('\n');
          for(var i = 0; i < data.length; i++) {
            if(data[i]) {
              Horses.insert({
                name: data[i],
                image: null,
                creationDate: new Date()
              });
            }
          }
          return false;
        },
        false
      );
      
      el.addEventListener(
        'paste',
        function(e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) e.stopPropagation();

          var data = e.clipboardData.getData('text/plain').split('\n');
          for(var i = 0; i < data.length; i++) {
            $log.info("drop " + data[i]);
          }
          
          return false;
        },
        false
      );
    }
  }
}]);