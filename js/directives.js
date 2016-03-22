angular.module('drawlol')
.directive('draw', function() {
  return {
    restrict: 'A',
    scope: false,
    link : function(scope){
      var canvas = window._canvas = new fabric.Canvas('c');
      canvas.setHeight(600);
      canvas.setWidth(800);
      canvas.isDrawingMode = true;
      canvas.backgroundColor = '#ffffff';
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.width = 3;
      scope.$parent.drawCanvas = canvas;
      canvas.renderAll();
    }
  };
}).directive('view', function($document) {
  return {
    restrict: 'A',
    scope: false,
    link : function(scope){
      var canvas = window._canvas = new fabric.Canvas('d');
      canvas.setHeight(600);
      canvas.setWidth(800);
      canvas.isDrawingMode = false;
      canvas.backgroundColor = '#ffffff';
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.width = 3;
      scope.$parent.viewCanvas = canvas;
      canvas.renderAll();
    }
  };
}).directive('review', function($document){
  return {
    restrict: 'A',
    scope: false,
    link : function(scope){
      var canvas = window._canvas = new fabric.Canvas('e');
      canvas.setHeight(Math.pow(scope.$parent.players.length, 2) * 600);
      canvas.setWidth(800);
      canvas.backgroundColor = '#ffffff';
      canvas.isDrawingMode = false;
      scope.$parent.reviewCanvas = canvas;
      console.log('review canvas', scope.$parent);
      canvas.renderAll();
    }
  }
})
