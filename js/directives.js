angular.module('drawlol')
.directive('draw', function() {
  return {
    restrict: 'A',
    scope: false,
    link : function(scope){
      console.log('draw', scope);
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
      console.log('view', scope);
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
})
