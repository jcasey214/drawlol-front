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
    $scope.gameCreated = true;
    $scope.roomName = $scope.createUsername;
    UsernameFactory.setUsername($scope.createUsername);
    $scope.gamePath = `/#/play/${$scope.roomName}${Date.now()}`
  }
  $scope.joinGame = function(){
  }
}).controller('GameController', function($scope, $routeParams, UsernameFactory, $document, $http){
  $scope.username = UsernameFactory.getUsername();
  $scope.room = $routeParams.game_id;
  $scope.players;
  $scope.creator = false;
  $scope.showStartButton = false;
  $scope.round = 0;
  $scope.currentSheet = $scope.username;
  $scope.gameInProgress = false;
  $scope.phase = 'draw';
  $scope.allowSubmit = false;
  $scope.gameOver = false;
  var socket;
  $scope.assignUsername = function(){
    $scope.username = $scope.createUsername;
    $scope.currentSheet = $scope.username;
    socket = io.connect('http://localhost:8000');
    socket.on('handshake', function(data){
      socket.emit('joinRoom', {roomName : $scope.room, user: $scope.username});
    });
    socket.on('joinSuccess', function(data){
    });
  }
  socket = io.connect('http://localhost:8000');
  socket.on('handshake', function(data){
    socket.emit('joinRoom', {roomName : $scope.room, user: $scope.username});
  });
  socket.on('joinSuccess', function(data){
    if(data.creator){
      $scope.creator = true;
      $scope.showStartButton = true;
      $scope.$digest();
    }
  });
  socket.on('userJoined', function(data){
    console.log('');
  });
  socket.on('success', function(data){
    $scope.allowSubmit = false;
    $scope.$apply();
  });
  socket.on('gameOver', function(data){
    $scope.players = data.players;
    $scope.phase = 'review';
    $scope.allowSubmit = false;
    $scope.gameInProgress = false;
    $scope.gameOver = true;
    $scope.allSheets = sheetView($scope.players);
    console.log('game over!', $scope.players);
    $scope.$apply();
  });
  $scope.chat = function(){
    socket.emit('chatMessage', {message: 'hello', room: $scope.room, user: $scope.username})
  };
  $scope.$on('$destroy', function(){
    socket.emit('leaveRoom', {room: $scope.room, user: $scope.username, bailed: true})
  });
  $scope.startGame = function(){
    socket.emit('start', {start: true, room: $scope.room})
  }
  socket.on('startGame', function(data){
    $scope.drawCanvas.clear();
    $scope.gameInProgress = true;
    $scope.round = 1;
    $scope.showStartButton = false;
    $scope.phase = 'view';
    $scope.allowSubmit = true;
    $scope.players = data.players;
    $scope.$apply();
    var text = new fabric.Text('The game has started \ntype in a sentence and click submit\nto start your sheet', { left: 100, top: 100, fontFamily: 'Arial' });
    $scope.viewCanvas.add(text);

  });
  socket.on('nextRound', function(data){
    $scope.round = data.round;
    $scope.players = data.players;
    if($scope.phase == 'view'){
      $scope.phase = 'draw';
    }else if($scope.phase == 'draw'){
      $scope.phase = 'view';
    }
    $scope.allowSubmit = true;
    $scope.currentSheet = getNextSheet(data.round, $scope.username, data.players);
    // console.log($scope.currentSheet);
    var sheetArray = $scope.players[$scope.currentSheet.index].sheet;
    if($scope.phase == 'draw'){
      $scope.sentenceToDraw = sheetArray[sheetArray.length - 1];
    }else if($scope.phase == 'view'){
      var imageToDescribe = sheetArray[sheetArray.length - 1];
      // console.log(imageToDescribe);
      fabric.loadSVGFromString(imageToDescribe, function(objects, options) {
        var obj = fabric.util.groupSVGElements(objects, options);
        $scope.viewCanvas.add(obj).renderAll();
      });
    }
    $scope.$apply();
  })
  $scope.send = function(){
    var svg = $scope.drawCanvas.toSVG({suppressPreamble: true});
    var sentence = $scope.sentence;
    // console.log('Sheet I\'m adding to is ', $scope.currentSheet.user || $scope.currentSheet);
    socket.emit('sheetSubmit',{
      sheet: $scope.currentSheet.user || $scope.currentSheet,
      phase: $scope.phase,
      round: $scope.round,
      roomName: $scope.room,
      user: $scope.username,
      sentence: sentence,
      image: svg
    })
    $scope.allowSubmit = false;
    $scope.sentence = '';
    $scope.drawCanvas.clear();
  }
}).controller('CompleteController', function($scope){
  $scope.greeting = "Hello World!";
});

function getNextSheet(round, username, players){
  var numPlayers = players.length;
  var userIndex;
  for(var i = 0; i < numPlayers; i++){
    if(players[i].username == username){
      userIndex = i;
      break;
    }
  }
  // console.log('user index is ', userIndex);
  // console.log('round number is ', round);
  // console.log('numPlayers is ', numPlayers);
  var nextIndex = userIndex + (round - 1);
  // console.log('nextIndex before eval is ', nextIndex);
  if(nextIndex > players.length - 1){
    // console.log('nextIndex eval was true');
    nextIndex = nextIndex - players.length;
  }
  // console.log('nextIndex after eval is ', nextIndex);
  // console.log('next player is ', players[nextIndex].username);
  return {user: players[nextIndex].username, index: nextIndex};
}


function sheetView(players){
  var result = [];
  players.forEach(function(player){
    player.sheet.forEach(function(item){
      if(item.match(/^\</)){
        item.replace('\\n', '');
        item.replace('\\"', '\'');
        item.replace('\"', '');
        result.push(item);
      }else{
        result.push(item)
      }
    })
  })
  console.log(result);
  return result;
}
