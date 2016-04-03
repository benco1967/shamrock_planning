angular.module('PlannerApp')
.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function($urlRouterProvider, $stateProvider, $locationProvider){
 
  $locationProvider.html5Mode(true);

  function checkUser($q) {
    if(Meteor.userId() == null) {
      return $q.reject('AUTH_REQUIRED');
    }
    else {
      return $q.resolve();
    }
  }
  function checkSuperAdmin($q) {
    if(!Roles.userIsInRole(Meteor.userId(), "admin")) {
      console.log(">>>>>>>>>>>> reject " + Meteor.userId());
      console.log(">>>>>>>>>>>> reject " + Roles.userIsInRole(Meteor.userId(), "admin"));
      console.log(">>>>>>>>>>>> reject " + Roles.userIsInRole(Meteor.user(), "admin"));
      return $q.reject('AUTH_REQUIRED');
    }
    else {
      return $q.resolve();
    }
  }
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
    .state('horsesList', {
      url: '/config/horses',
      template: '<horses-list></horses-list>',
      resolve: {
        currentUser: checkUser
      }
    })
    .state('horsesDetails', {
      url: '/config/horses/:id',
      template: '<horse-details></horse-details>',
      resolve: {
        currentUser: checkUser
      }
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
    })
    .state('adminDashboard', {
      url: '/admin',
      template: '<admin-dashboard></admin-dashboard>',
      resolve: {
        currentUser: checkSuperAdmin
      }
    })
    .state('adminGroups', {
      url: '/admin/groups',
      template: '<admin-groups></admin-groups>',
      resolve: {
        currentUser: checkSuperAdmin
      }
    })
    .state('adminUsers', {
      url: '/admin/users',
      template: '<admin-users></admin-users>',
      resolve: {
        currentUser: checkSuperAdmin
      }
    })
    .state('adminUserDetails', {
      url: '/admin/users/:id',
      template: '<admin-user-details></admin-user-details>',
      resolve: {
        currentUser: checkSuperAdmin
      }
    });

  $urlRouterProvider.otherwise("/home");
}])
.run(function ($rootScope, $state) {
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    if(error == 'AUTH_REQUIRED') {
      $state.go('home');
    }
  })
});