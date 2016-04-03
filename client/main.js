angular.module('PlannerApp')
.controller('MainCtrl', ['$scope', '$modal', function ($scope, $modal) {
  function checkCode(mode) {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'client/components/util/modalSecureCode.html',
      controller: 'ModalSecureCodeCtrl',
      size: 'sm'
    });

    modalInstance.result.then(function () {
      $scope.secured = mode;
    });
  }
  $scope.secured = false;
  $scope.secureMode = function() {
    checkCode(true);
  };
  $scope.unsecureMode = function() {
    checkCode(false);
  };
  $scope.bodyStyle = function() {
    return $scope.secured ? {} : {"padding-top": "70px"};
  };
}]);