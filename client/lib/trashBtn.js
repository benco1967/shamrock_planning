/**
 * Created by benoit.chanclou on 02/04/2016.
 */
angular.module('PlannerApp')

.directive('trashBtn', ['$log', function($log) {
  var currentConfirm = null;
  return {
    restrict: 'E',
    scope: {
      deleteFn: '&onDelete'
    },
    controller: ['$scope', function($scope) {
      var confirm = {
        value: false
      };
      $scope.isConfirmShown = function () {
        return confirm.value;
      }
      $scope.showConfirm = function() {
        if(currentConfirm !== null) {
          currentConfirm.value = false;
        }
        currentConfirm = confirm;
        confirm.value = true;
      }
      $scope.hideConfirm = function() {
        currentConfirm = null;
        confirm.value = false;
      }
      $scope.remove = function() {
        $scope.deleteFn && $scope.deleteFn();
        $scope.hideConfirm();
      };
    }],
    templateUrl: 'client/lib/trashBtn.html'
  };
}])