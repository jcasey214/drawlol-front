angular.module('drawlol').directive('draw', function($document) {
  return {
    restrict: 'A',
    transclude: true,
    scope: false,
    link : function(scope){
      var canvas = window._canvas = new fabric.Canvas('c');
      canvas.setHeight(600);
      canvas.setWidth(800);
      canvas.isDrawingMode = true;
      canvas.backgroundColor = '#ffffff';
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.width = 3;
      canvas.renderAll();
      scope.canvas = canvas;
    }
  };
});
