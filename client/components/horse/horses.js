
angular.module('PlannerApp')
.directive('horseDetails', ["$log", function($log) {
  return {
    restrict: 'E',
    templateUrl: 'client/components/horse/horse-details.html',
    controllerAs: 'horseDetails',
    controller: ['$scope', '$stateParams', '$reactive', '$state', function ($scope, $stateParams, $reactive, $state) {
      $reactive(this).attach($scope);
      this.id = $stateParams.id;
      this.subscribe('users');
      this.subscribe('horses', function() {
        return [ Session.get("groupId") ];
      });

      this.helpers({
        horse: function() {
          var tmp = Horses.findOne({ _id: $stateParams.id });
          if(!tmp) {
            $state.go("horsesList");
          }
          return tmp;
        },
        users: function() {
          return Meteor.users.find();
        }
      });
      this.addNote = function () {
        if(this.horse.notes === undefined) {
          this.horse.notes = [];
        }
        this.horse.notes.push({date: new Date(), text: ""});
      }
      this.removeNote = function (index) {
        this.horse.notes.splice(index, 1);
      }
      this.addCare = function () {
        if(this.horse.careHistory === undefined) {
          this.horse.careHistory = [];
        }
        this.horse.careHistory.push({date: new Date(), type: ""});
      }
      this.removeCare = function (index) {
        this.horse.careHistory.splice(index, 1);
      }

      this.save = function () {
        Horses.update(
          {_id: this.id},
          {
            $set: {
              name: this.horse.name,
              image: this.horse.image,
              lastUpdate: new Date(),
              tags: this.horse.tags,
              category: this.horse.category,
              birthYear: this.horse.birthYear,
              notes: angular.copy(this.horse.notes),
              careHistory: angular.copy(this.horse.careHistory)
            }
          },
          function(error) {
            if (error) {
              console.log("Oops, unable to update the horse... " + error.message);
            }
            else {
              console.log("Horse saved!");
              $state.go("horsesList");
            }
          }
        );
      }
    }]
  }
}])
.directive('horsesList', ["$log", function ($log) {
  return {
    restrict: 'E',
    templateUrl: 'client/components/horse/horses-list.html',
    controllerAs: 'horsesList',
    controller: ['$scope', '$reactive', function ($scope, $reactive) {
      $reactive(this).attach($scope);
      this.subscribe('horses', function() {
        return [ Session.get("groupId") ];
      });
      this.subscribe('users');

      this.newHorse = {};

      this.helpers({
        horses: function() {
          return Horses.find();
        },
        users: function() {
          return Meteor.users.find();
        }
      });
      this.addHorse = function() {
        this.newHorse.creationDate = new Date();
        this.newHorse.owner = Session.get("groupId");
        Horses.insert(this.newHorse);
        this.newHorse = {};
      };
      this.removeHorse = function(horse) {
        Horses.remove(horse._id);
      };
    }]
  }
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