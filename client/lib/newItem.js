angular.module('PlannerApp')

.directive('newItem', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      editFct: '&onEdit',
      createFct: '&onCreate'
    },
    controller: function($scope) {

      $scope.state = 'wait';
      $scope.isState = function(state) {
        return $scope.state == state;
      }

      $scope.edit = function() {
        $scope.editFct && $scope.editFct();
        $scope.state = 'editing';
      };
      $scope.create = function() {
        $scope.createFct && $scope.createFct();
        $scope.cancel();
      };
      $scope.cancel = function() {
        $scope.state = 'wait';
      };
    },
    link: function (scope, iElem, iAttrs, ctrl, transcludeFn) {
       transcludeFn(function(clone) {
        angular.forEach(clone, function (cloneElt) {
          // node type 3 is "text" node
          if (cloneElt.nodeType === 3)  {
            return;
          }
          // get target name from clone and find target
          var type = cloneElt.attributes["type"].value;
          var destination = iElem.find("[transclude-id='" + type.toLowerCase() + "']");
          // append target if found
          if (destination.length) {
            destination.append(cloneElt);
          } else {
           // if target isn't found (missing/invalid transclude), clean up and throw error         
            var name = cloneElt.nodeName;
            cloneElt.remove();
            throw new Error(
              'Target ' + name + ' not found. Please specify the correct transclude-to attribute.' 
            );
          }
        });      
      });
    },
    templateUrl: 'client/lib/newItem.html'
  };
});