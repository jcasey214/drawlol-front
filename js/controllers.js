var io = require('socket.io-client/socket.io.js');

module.exports = angular.module('drawlol').controller('HomeController', function($scope) {
  $scope.greeting = "Hello World!";
}).controller('CreateController', function($scope, UsernameFactory){
  $scope.gameCreated = false;
  $scope.roomName = '';
  $scope.gamePath = '';
  $scope.username = null;
  $scope.host = window.location.origin;
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
}).controller('GameController', function($scope, $routeParams, UsernameFactory, $document, $http){
  $scope.username = UsernameFactory.getUsername();
  $scope.room = $routeParams.game_id;
  $scope.players = [];
  $scope.creator = false;
  $scope.showStartButton = false;
  $scope.round = 0;
  $scope.currentSheet = $scope.username;
  $scope.gameInProgress = false;
  $scope.phase = 'draw';
  $scope.allowSubmit = false;
  var socket;
  $scope.assignUsername = function(){
    $scope.username = $scope.createUsername;
    $scope.currentSheet = $scope.username
    socket = io.connect('http://localhost:8000');
    socket.on('handshake', function(data){
      console.log(data);
      console.log('this is the username', $scope.username);
      socket.emit('joinRoom', {roomName : $scope.room, user: $scope.username});
    });
    socket.on('joinSuccess', function(data){
      console.log(data);
    });
  }
  socket = io.connect('http://localhost:8000');
  socket.on('handshake', function(data){
    console.log(data);
    console.log('this is the username', $scope.username);
    socket.emit('joinRoom', {roomName : $scope.room, user: $scope.username});
  });
  socket.on('joinSuccess', function(data){
    console.log(data);
    if(data.creator){
      $scope.creator = true;
      $scope.showStartButton = true;
      $scope.$digest();
    }
  });
  socket.on('userJoined', function(data){
    $scope.players.push(data.user);
  });
  socket.on('success', function(data){
    console.log('entry submitted successfully');
    $scope.allowSubmit = false;
    $scope.$apply();
  })
  $scope.chat = function(){
    socket.emit('chatMessage', {message: 'hello', room: $scope.room, user: $scope.username})
  };
  $scope.$on('$destroy', function(){
    socket.emit('leaveRoom', {room: $scope.room, user: $scope.username, bailed: true})
  });
  $scope.startGame = function(){
    console.log('start game clicked');
    socket.emit('start', {start: true, room: $scope.room})
  }
  socket.on('startGame', function(data){
    $scope.drawCanvas.clear();
    $scope.gameInProgress = true;
    $scope.round = 1;
    $scope.showStartButton = false;
    $scope.phase = 'view';
    $scope.allowSubmit = true;
    $scope.$apply();
    console.log($scope);
    var text = new fabric.Text('The game has started \ntype in a sentence and click submit\nto start your sheet', { left: 100, top: 100, fontFamily: 'Arial' });
    $scope.viewCanvas.add(text);

  });
  socket.on('nextRound', function(data){
    console.log('next round', data);
    $scope.round = data.round;
    if($scope.phase == 'view'){
      $scope.phase = 'draw';
    }else if($scope.phase == 'draw'){
      $scope.phase = 'view';
    }
    console.log('update next round', $scope.round);
    $scope.allowSubmit = true;
    $scope.$digest();
  })
  $scope.send = function(){
    console.log("send");
    var svg = $scope.drawCanvas.toSVG({suppressPreamble: true});
    var sentence = $scope.sentence;
    socket.emit('sheetSubmit',{
      sheet: $scope.currentSheet,
      phase: $scope.phase,
      round: $scope.round,
      roomName: $scope.room,
      user: $scope.username,
      sentence: sentence,
      image: svg
    })
    $scope.allowSubmit = false;
    console.log(sentence);
  }
}).controller('CompleteController', function($scope){
  $scope.greeting = "Hello World!";
});
