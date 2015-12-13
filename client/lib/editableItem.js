angular.module('PlannerApp')

.directive('editableItem', function() {
  var currentEditingScope = false;
  var templateUrl = null;
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      saveFct: '&onSave',
      deleteFct: '&onDelete',
      editFct: '&onEdit',
      createFct: '&onCreate',
      cancelSaveFct: '&onCancelEdit'
    },
    controller: function($scope) {
      function setState(state) {
        switch(state) {
          case "editing":
          case "deleting":
            currentEditingScope = $scope.$id;
            $scope.state = state;
            break;
          case "wait":
            if(currentEditingScope === $scope.$id) {
              currentEditingScope = false;
            }
            $scope.state = state;
            break;
        }
      }
      $scope.state = 'wait';
      $scope.isState = function(state) {
        return $scope.state == state;
      }

      $scope.edit = function() {
        $scope.editFct && $scope.editFct();
        setState('editing');
      };
      $scope.save = function() {
        $scope.saveFct && $scope.saveFct();
        setState('wait');
      };
      $scope.create = function() {
        $scope.createFct && $scope.createFct();
        setState('wait');
      };
      $scope.delete = function() {
        setState('deleting');
      };
      $scope.remove = function() {
        $scope.deleteFct && $scope.deleteFct();
        setState('wait');
      };
      $scope.cancelEdit = function() {
        $scope.cancelSaveFct && $scope.cancelSaveFct();
        setState('wait');
      };
      $scope.cancelRemove = function() {
        setState('wait');
      };
      $scope.$watch(function() { return currentEditingScope; }, function() {
        if(currentEditingScope !== $scope.$id) {
          switch($scope.state) {
            case "editing" : $scope.cancelEdit(); break;
            case "deleting" : $scope.cancelRemove(); break;
          }
        }
      });
    },
    link: function (scope, elt, attrs, ctrl, transcludeFct) {
      scope.withCreate = attrs.onCreate !== undefined;
      scope.withEdit = attrs.onSave !== undefined;
      scope.withDelete = attrs.onDelete !== undefined;
      
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