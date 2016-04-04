/**
 * Created by benoit.chanclou on 03/04/2016.
 */
angular.module('PlannerApp')
.directive('adminDashboard', ["$log", function ($log) {
  return {
    restrict: 'E',
    templateUrl: 'client/components/admin/admin-dashboard.html',
    controllerAs: 'adminDashboard',
    controller: ['$scope', '$reactive', function ($scope, $reactive) {
    }]
  }
}])
.directive('adminUserDetails', ["$log", function ($log) {
  return {
    restrict: 'E',
    templateUrl: 'client/components/admin/admin-user-details.html',
    controllerAs: 'adminUserDetails',
    controller: ['$scope', '$stateParams', '$reactive', '$state', function ($scope, $stateParams, $reactive, $state) {
      $reactive(this).attach($scope);
      this.subscribe('allUserData');
      this.subscribe('groups');
      this.id = $stateParams.id;
      this.newGroup = {
        name: "",
        role: ""
      };

      this.helpers({
        user: function() {
          return Meteor.users.findOne({ _id: $stateParams.id });
        },
        groups: function() {
          return Groups.find();
        },
        roles: function() {
          return [ "member", "manager" ];
        }
      });

      this.isAdmin = function () {
        return Roles.userIsInRole(this.id, 'admin');
      }
      this.getGroupName = function(groupId) {
        return Groups.findOne(groupId).name;
      }
      function updateGroupForUser(funcName, user, group, role) {
        Meteor.apply(funcName,
            [user, group, role],
            function(error) {
              if (error) {
                console.log("Oops, unable to update the user... " + error.message);
              }
              else {
                console.log("user saved!");
                this.newGroup = {
                  name: "",
                  role: ""
                };
              }
            });
      }
      this.addRole = function () {
        updateGroupForUser("setRoleForUser", this.id, this.newGroup.name, this.newGroup.role);
      }
      this.removeRole = function (group, role) {
        updateGroupForUser("removeRoleForUser", this.id, group, role);
      }
    }]
  }
}])
.directive('adminUsers', ["$log", function ($log) {
  return {
    restrict: 'E',
    templateUrl: 'client/components/admin/admin-users.html',
    controllerAs: 'adminUsers',
    controller: ['$scope', '$reactive', function ($scope, $reactive) {
      $reactive(this).attach($scope);
      this.subscribe('allUserData');
      this.subscribe('groups');

      this.helpers({
        users: function() {
          return Meteor.users.find();
        },
        groups: function() {
          return Groups.find();
        }
      });
      this.isAdmin = function (user) {
        return Roles.userIsInRole(user._id, 'admin');
      }
      this.save = function (id) {
        Meteor.users.update(
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
.directive('adminGroups', ["$log", function ($log) {
  return {
    restrict: 'E',
    templateUrl: 'client/components/admin/admin-groups.html',
    controllerAs: 'adminGroups',
    controller: ['$scope', '$reactive', function ($scope, $reactive) {
      $reactive(this).attach($scope);
      this.subscribe('groups');

      this.newGroup = {}; 
      
      this.helpers({
        groups: function() {
          return Groups.find();
        }
      });
      this.addGroup = function() {
        this.newGroup.creationDate = new Date();
        Groups.insert(this.newGroup);
        this.newGroup = {};
      };
    }]
  }
}]);