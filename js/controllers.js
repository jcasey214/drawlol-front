module.exports = angular.module('drawlol').controller('HomeController', function($scope) {
  $scope.greeting = "Hello World!";
}).controller('CreateController', function($scope){
  $scope.greeting = "Hello World!";
  $scope.gameCreated = false;
  $scope.createGame = function(){
    console.log('clicked', $scope.createUsername);
    $scope.gameCreated = true;
  }
  $scope.joinGame = function(){
    console.log('clicked join');
  }
}).controller('JoinController', function($scope){
  $scope.greeting = "Hello World!";
}).controller('GameController', function($scope){
  $scope.greeting = "Hello World!";
}).controller('CompleteController', function($scope){
  $scope.greeting = "Hello World!";
});
