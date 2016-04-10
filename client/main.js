angular.module('PlannerApp')

.directive('main', ["$log", function ($log) {
  return {
    restrict: 'E',
    templateUrl: 'client/main.html',
    controllerAs: 'main',
    controller: ['$scope', '$reactive', '$modal', function ($scope, $reactive, $modal) {
      $reactive(this).attach($scope);
      this.subscribe('groups', function() {
        return [ Meteor.userId() ];
      });

      this.secured = false;
      var self = this;
      function checkCode(mode) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'client/components/util/modalSecureCode.html',
          controller: 'ModalSecureCodeCtrl',
          size: 'sm'
        });

        modalInstance.result.then(function () {
          self.secured = mode;
        });
      };
      this.secureMode = function () {
        checkCode(true);
      };
      this.unsecureMode = function () {
        checkCode(false);
      };
      this.setGroup = function (groupId) {
        Session.set("groupId", groupId);
      };
      this.helpers({
        groups: function() {
          return Groups.find();
        },
        groupsCount: function() {
          return Groups.find().count();
        },
        currentGroup: function() {
          var query = Groups.find();
          var groupId = Session.get("groupId");
          var group;
          if(groupId === undefined) {
            if(query.count() !== 1) {
              return "--";
            }
            group = query.fetch()[0];
            Meteor.setTimeout(function() { self.setGroup(group._id); }, 0);
          }
          else {
            group = Groups.findOne(groupId);
          }
          var name = group !== undefined ? group.name : "--";
          return name;
        }
      });
    }]
  };
}]);