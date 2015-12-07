angular.module('PlannerApp')
.controller('ModalSecureCodeCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

  $scope.secureCode = "";

  $scope.ok = function () {
    if($scope.secureCode == "aaaa") {
      $modalInstance.close();
    }
    else {
      $modalInstance.dismiss('cancel');
    }
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);