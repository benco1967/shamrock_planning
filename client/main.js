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
}])
.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function($urlRouterProvider, $stateProvider, $locationProvider){
 
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'client/components/home/home.html',
      controller: 'HomeCtrl'
    })
    .state('calendar', {
      url: '/calendar',
      templateUrl: 'client/components/planner/calendar.html',
      controller: 'CalendarCtrl'
    })
    .state('statsWeek', {
      url: '/stats/week',
      templateUrl: 'client/components/statistics/week.html',
      controller: 'StatsWeekCtrl'
    })
    .state('statsDay', {
      url: '/stats/day',
      templateUrl: 'client/components/statistics/day.html',
      controller: 'StatsDayCtrl'
    })
    .state('horses', {
      url: '/config/horses',
      templateUrl: 'client/components/horse/horses.html',
      controller: 'HorsesCtrl'
    })
    .state('instructors', {
      url: '/config/instructors',
      templateUrl: 'client/components/person/instructors.html',
      controller: 'InstructorsCtrl'
    })
    .state('riders', {
      url: '/config/riders',
      templateUrl: 'client/components/person/riders.html',
      controller: 'RidersCtrl'
    })
    .state('templates', {
      url: '/config/templates',
      templateUrl: 'client/components/lesson/lessonsTemplates.html',
      controller: 'LessonsTemplatesCtrl'
    })
    .state('lessons', {
      url: '/config/templates/:id',
      templateUrl: 'client/components/lesson/lessons.html',
      controller: 'LessonsCtrl'
    });

  $urlRouterProvider.otherwise("/home");
}]);