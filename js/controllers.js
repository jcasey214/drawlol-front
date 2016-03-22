var io = require('socket.io-client/socket.io.js');
var serverURL = 'http://localhost:8000';
// var serverURL = 'https://drawlol-node.herokuapp.com/';

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
  $scope.gameInProgress = true;
  $scope.phase = 'draw';
  $scope.allowSubmit = false;
  $scope.gameOver = false;
  $scope.joinDisabled = false;
  $scope.gameDirections = `Waiting for organizer to start game.`;
  $scope.chatMessages = [];
  var socket;
  $scope.assignUsername = function(){
    $scope.username = $scope.createUsername;
    $scope.currentSheet = $scope.username;
    socket = io.connect(serverURL);
    socket.on('handshake', function(data){
      socket.emit('joinRoom', {roomName : $scope.room, user: $scope.username});
    });
    socket.on('joinSuccess', function(data){
      $scope.created_by = data.created_by;
    });
  }
  socket = io.connect(serverURL);
  socket.on('handshake', function(data){
    socket.emit('joinRoom', {roomName : $scope.room, user: $scope.username});
  });
  socket.on('joinSuccess', function(data){
    if(data.creator){
      $scope.creator = true;
      $scope.showStartButton = true;
      $scope.created_by = data.created_by;
      $scope.$digest();
    }else{
      $scope.creator = false;
      $scope.showStartButton = false;
      $scope.created_by = data.created_by;
      $scope.$digest();
    }
  });
  socket.on('userJoined', function(data){
    $scope.players = data.players;
    $scope.$digest();
  });
  socket.on('sorry', function(data){
    $scope.joinDisabled = true;
  })
  socket.on('userDisconnect', function(data){
    console.log('user disconnected');
    console.log(data);
    $scope.players = data.players;
    $scope.$digest();
  });
  socket.on('success', function(data){
    $scope.allowSubmit = false;
    $scope.$digest();
  });
  socket.on('gameOver', function(data){
    $scope.players = data.players;
    $scope.phase = 'review';
    $scope.allowSubmit = false;
    $scope.gameInProgress = false;
    $scope.gameOver = true;
    $scope.$digest();
    // $scope.allSheets = sheetView($scope.players);
    $scope.players.forEach(function(player, playerIndex){
      var playerName = new fabric.Text(`${player.username}'s Sheet`, {top: playerIndex * 500 * (player.sheet.length - 1) + 10, left: 5, fontFamily: 'Arial', stroke: "#4ABDAC", fill: "#4ABDAC"});
      $scope.reviewCanvas.add(playerName);
      player.sheet.forEach(function(item, sheetIndex){
        if(item.match(/^\</)){
          console.log(item, sheetIndex);
          item.replace('#ffffff', 'rgba(0,0,0,0)');
          fabric.loadSVGFromString(item, function(objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.set({
              top: (30 + (playerIndex * 500 * (player.sheet.length - 1) + 10) + (500 * (sheetIndex - 1)))
            });
            $scope.reviewCanvas.add(obj).renderAll();
          });
        }else{
          var sentence = new fabric.Text(item, { top: sheetIndex == 0? (50 + (playerIndex * 500 * (player.sheet.length - 1) + 10) + (500 * sheetIndex)):(50 + (playerIndex * 500 * (player.sheet.length - 1)) + (500 * (sheetIndex - 1))) , left: 50, fontSize: 20, fontFamily: 'Arial', stroke: "#FC4A1A", fill: "#FC4A1A"});
          $scope.reviewCanvas.add(sentence);
        }
      })
      $scope.reviewCanvas.renderAll();
    })

    $scope.gameDirections = 'Game Over';
    console.log('game over!', $scope.players);
    $scope.$digest();
  });
  $scope.chat = function(){
    socket.emit('chatMessage', {message: $scope.chatMessage, room: $scope.room, user: $scope.username})
    $scope.chatMessage = '';
  };
  socket.on('chatMessage', function(data){
    console.log(data);
    $scope.chatMessages.push(data);
    $scope.$digest();
  })
  // $scope.$on('$destroy', function(){
  //   console.log('destroying page');
  //   socket.emit('leaveRoom', {room: $scope.room, user: $scope.username, bailed: true})
  // });
  $scope.startGame = function(){
    socket.emit('start', {start: true, room: $scope.room})
  };
  $scope.$on('onUnload', function( event ) {
    if($scope.gameInProgress){
      console.log('leaving page');
      socket.emit('leaveRoom', {roomName: $scope.room, user: $scope.username, bailed: true});
      // var answer = confirm("Are you sure you want to leave this page?");
      // if (!answer) {
      //     event.preventDefault();
      // }else{
      //   socket.emit('leaveroom', {room: $scope.room, user: $scope.username, bailed: true})
      // }
    }
  });
  $scope.$on('onBeforeUnload', function (e, confirmation) {
    if($scope.gameInProgress && $scope.username){
      confirmation.message = "All data willl be lost.";
      e.preventDefault();
    }
              // if(confirmation.message){
        //   socket.emit('leaveRoom', {room: $scope.room, user: $scope.username, bailed: true});
        // }
  });
  // $scope.$on('$locationChangeStart', function(e){
  //   socket.emit('leaveRoom', {room: $scope.room, user: $scope.username, bailed: true});
  // })

  socket.on('startGame', function(data){
    $scope.drawCanvas.clear();
    $scope.gameInProgress = true;
    $scope.round = 1;
    $scope.showStartButton = false;
    $scope.phase = 'view';
    $scope.allowSubmit = true;
    $scope.players = data.players;
    $scope.gameDirections = '';
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
    $scope.gameDirections = '';
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
    $scope.gameDirections = 'Entry submitted. Waiting for other players to finish. Tell them to hurry up!'
    $scope.sentence = '';
    $scope.drawCanvas.clear();
  }
  $scope.selectEraser = function(){
    $scope.drawCanvas.freeDrawingBrush.color = '#ffffff';
    $scope.drawCanvas.freeDrawingBrush.width = 10;
  };
  $scope.selectPencil = function(){
    $scope.drawCanvas.freeDrawingBrush.color = '#000000';
    $scope.drawCanvas.freeDrawingBrush.width = 2;
  };
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


// function sheetView(players){
//   var result = [];
//   players.forEach(function(player){
//     player.sheet.forEach(function(item){
//       if(item.match(/^\</)){
//         item.replace('\\n', '');
//         item.replace('\\"', '\'');
//         item.replace('\"', '');
//         item.replace('#ffffff', 'rgba(0,0,0,0)');
//         result.push(item);
//       }else{
//         result.push(item)
//       }
//     })
//   })
//   console.log(result);
//   return result;
// }
