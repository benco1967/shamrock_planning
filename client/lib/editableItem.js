angular.module('PlannerApp')

.directive('editableItem', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      saveFct: '&onSave',
      deleteFct: '&onDelete',
      startEditFct: '&onEdit',
      cancelSaveFct: '&onCancelSave'
    },
    controller: function($scope) {
      $scope.state = 'wait';
      $scope.isState = function(state) {
        return $scope.state == state;
      }

      $scope.edit = function() {
        $scope.startEditFct && $scope.startEditFct();
        $scope.state = 'editing';
      };
      $scope.save = function() {
        $scope.saveFct && $scope.saveFct();
        $scope.cancel();
      };
      $scope.delete = function() {
        $scope.state = 'deleting';
      };
      $scope.remove = function() {
        $scope.deleteFct && $scope.deleteFct();
        $scope.cancel();
      };
      $scope.cancelSave = function() {
        $scope.cancelSaveFct && $scope.cancelSaveFct();
        $scope.cancel();
      };
      $scope.cancel = function() {
        $scope.state = 'wait';
      };
    },
    link: function (scope, elt, attrs, ctrl, transcludeFct) {
      transcludeFct(function(clone) {
        angular.forEach(clone, function (cloneElt) {
          // node type 3 is "text" node
          if (cloneElt.nodeType === 3)  {
            return;
          }
          // get target name from clone and find target
          var type = cloneElt.attributes["type"].value;
          var destination = elt.find("[transclude-id='" + type.toLowerCase() + "']");
          // append target if found
          if (destination.length) {
            destination.append(cloneElt);
          } else {
           // if target isn't found (missing/invalid transclude), clean up and throw error 
            cloneElt.remove();
            throw new Error(
              'Target for ' + type + ' not found. Please specify the correct type attribute.' 
            );
          }
        });      
      });
    },
    templateUrl: 'client/lib/editableItem.html'
  };
});