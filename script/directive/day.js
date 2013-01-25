angular.module('app').directive('day', ['$rootScope', 'quo',function(root, $$){
  var currentDay =  root.currentDay || '';


  var postLink = function(scope, iElement, iAttrs){
    $$(iElement[0]).tap(function(){
      var day = scope.$eval(iAttrs.day);
      root.currentDay = day;
      root.$emit('changeCurrentDay');
    });
  };
  var directiveDefinitionObject = {
    priority    : 0,
    replace     : false,
    transclude  : false,
    restrict    : 'A',
    scope       : false,
    link     : postLink
  };

  return directiveDefinitionObject;

}]);