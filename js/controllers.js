var io = require('socket.io-client/socket.io.js');
// var io = require('../node_modules/socket.io-client/socket.io.js');
module.exports = angular.module('drawlol').controller('HomeController', function($scope) {
  $scope.greeting = "Hello World!";
}).controller('CreateController', function($scope, UsernameFactory){
  $scope.gameCreated = false;
  $scope.roomName = '';
  $scope.gamePath = '';
  $scope.username = null;
  $scope.host = 'http://localhost:8080'
  $scope.createGame = function(){
    console.log('clicked', $scope.createUsername);
    $scope.gameCreated = true;
    $scope.roomName = $scope.createUsername;
    UsernameFactory.setUsername($scope.createUsername);
    $scope.gamePath = `/#/play/${$scope.roomName}${Date.now()}`
  }
  $scope.joinGame = function(){
    console.log('clicked join');
  }
}).controller('JoinController', function($scope){
  $scope.greeting = "Hello World!";
}).controller('GameController', function($scope, $routeParams, UsernameFactory, $document){
  $scope.username = UsernameFactory.getUsername();
  $scope.room = $routeParams.game_id;
  $scope.assignUsername = function(){
    $scope.username = $scope.createUsername;
  }
  var socket = io.connect('http://localhost:8000');
  socket.on('hello', function(data){
    console.log(data);
    console.log('this is the username', $scope.username);
    socket.emit('room', {roomName : $scope.room});
  });
  socket.on('welcome', function(data){
    console.log(data);
  });
  socket.on('wtf', function(data){
    console.log('wtf',data.message)
  });
  $scope.sayHello = function(){
    socket.emit('greeting', {message: 'hello', room: $scope.room, user: $scope.username})
  };
  $scope.$on('$destroy', function(){
    socket.emit('bailsor', {room: $scope.room, bailed: true})
  });
  $scope.send = function(){
    console.log("send");
    console.log($scope.canvas);
    var svg = $scope.canvas.toSVG({suppressPreamble: true});
    console.log(svg);
  }
}).controller('CanvasController', function($scope, UsernameFactory){
  $scope.username = UsernameFactory.getUsername();
  $scope.canvas = new fabric.Canvas('drawingCanvas');
}).controller('CompleteController', function($scope){
  $scope.greeting = "Hello World!";
});
