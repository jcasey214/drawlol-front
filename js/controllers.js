var io = require('socket.io-client/socket.io.js');
// var io = require('../node_modules/socket.io-client/socket.io.js');
module.exports = angular.module('drawlol').controller('HomeController', function($scope) {
  $scope.greeting = "Hello World!";
}).controller('CreateController', function($scope){
  $scope.gameCreated = false;
  $scope.roomName = '';
  $scope.gamePath = '';
  $scope.host = 'http://localhost:8080'
  $scope.createGame = function(){
    console.log('clicked', $scope.createUsername);
    $scope.gameCreated = true;
    $scope.roomName = $scope.createUsername;
    $scope.gamePath = `/#/play/${$scope.roomName}${Date.now()}`
  }
  $scope.joinGame = function(){
    console.log('clicked join');
  }
}).controller('JoinController', function($scope){
  $scope.greeting = "Hello World!";
}).controller('GameController', function($scope, $routeParams){
  $scope.room = $routeParams.game_id;
  var socket = io.connect('http://localhost:8000');
  socket.on('hello', function(data){
    console.log(data);
  })
}).controller('CompleteController', function($scope){
  $scope.greeting = "Hello World!";
});
