app.config(function($routeProvider, $locationProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'home.html',
    controller: 'HomeController'
  })
  .when('/create', {
    templateUrl: 'create.html',
    controller: 'CreateController'
  })
  .when('/join', {
    templateUrl: 'join.html',
    controller: 'JoinController'
  })
  .when('/play/:game_id', {
    templateUrl: 'game.html',
    controller: 'GameController'
  })
  .when('/complete/:game_id', {
    templateUrl: 'complete.html',
    controller: 'CompleteController'  
  })
})
