module.exports = angular.module('drawlol').config(function($routeProvider, $locationProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'partials/home.html',
    controller: 'HomeController'
  })
  .when('/create', {
    templateUrl: 'partials/create.html',
    controller: 'CreateController'
  })
  .when('/join', {
    templateUrl: 'partials/join.html',
    controller: 'JoinController'
  })
  .when('/play/:game_id', {
    templateUrl: 'partials/game.html',
    controller: 'GameController'
  })
  .when('/complete/:game_id', {
    templateUrl: 'partials/complete.html',
    controller: 'CompleteController'
  })
})
