angular.module('PlannerApp')

.directive('editableItem', ['$log', function($log) {
  var currentEditingId = false;
  var editDuplicate = false;
  var templateUrl = null;
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      _id: '=id',
      saveFn: '&onSave',
      deleteFn: '&onDelete',
      editFn: '&onEdit',
      createFn: '&onCreate',
      cancelSaveFn: '&onCancelEdit',
      duplicateFn: '&onDuplicate'
    },
    controller: function($scope) {
      function setState(state) {
        switch(state) {
          case "editing":
          case "deleting":
            currentEditingId = $scope._id;
            $scope.state = state;
            break;
          case "wait":
            if(currentEditingId === $scope._id) {
              currentEditingId = false;
            }
            $scope.state = state;
            break;
        }
      }
      $scope.state = 'wait';
      $scope.isState = function(state) {
        return $scope.state == state;
      }

      $scope.duplicate = function() {
        currentEditingId = $scope.duplicateFn && $scope.duplicateFn();
        editDuplicate = true;
      }
      $scope.edit = function() {
        $scope.editFn && $scope.editFn();
        setState('editing');
      };
      $scope.save = function() {
        $scope.saveFn && $scope.saveFn();
        setState('wait');
      };
      $scope.create = function() {
        $scope.createFn && $scope.createFn();
        setState('wait');
      };
      $scope.delete = function() {
        setState('deleting');
      };
      $scope.remove = function() {
        $scope.deleteFn && $scope.deleteFn();
        setState('wait');
      };
      $scope.cancelEdit = function() {
        $scope.cancelSaveFn && $scope.cancelSaveFn();
        setState('wait');
      };
      $scope.cancelRemove = function() {
        setState('wait');
      };
      $scope.$watch(function() { return currentEditingId; }, function() {
        if(currentEditingId !== $scope._id) {
          switch($scope.state) {
            case "editing" : $scope.cancelEdit(); break;
            case "deleting" : $scope.cancelRemove(); break;
          }
        }
        else if($scope.state == 'wait' && editDuplicate) {
          editDuplicate = false;
          $scope.edit();
        }
      });
      $log.info('_id ' + $scope._id);
    },
    link: function (scope, elt, attrs, ctrl, transcludeFn) {
      scope.withCreate = attrs.onCreate !== undefined;
      scope.withEdit = attrs.onSave !== undefined;
      scope.withDelete = attrs.onDelete !== undefined;
      scope.withDuplicate = attrs.onDuplicate !==undefined;
      
      transcludeFn(function(clone) {
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
}]);