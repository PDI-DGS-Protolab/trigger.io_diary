angular.module('app').controller('add',['$rootScope', '$scope', 'webdb', 'forge',function(rootScope, scope, webdb, forge){
  var _getLocation = function(success, error){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      error(new Error('not support'));
    }
  };
  var _positionToString = function(position){
    var p = position.coords;
    return [p.latitude, p.longitude].join(' , ');
  };
  var _onAdd = function(){
    rootScope.$emit('addItem');
  };
  var _onError = function(e){
    alert(e);
  };
  scope.data = {
    note:'',
    position:''
  };
  scope.addNote = function(){
    var day = rootScope.currentDay;
    var note = scope.data.note;
    if(day){
      webdb.addNote(day, note, _onAdd, _onError);
    }else{
      alert('Day no existe');
      alert(day);
    }


  };
  scope.addPosition = function(){
    var day = rootScope.currentDay;
    var position = scope.data.position;
    webdb.addPosition(day, position, _onAdd, _onError);
  };
  scope.setLocation = function(){
    _getLocation(function(position){
      scope.$apply(function() {
          scope.data.position = _positionToString(position);
      });
    }, function(e){
      //console.log(e);
    });
  };

  scope.addPhoto = function(){
    var day = rootScope.currentDay;
    var onSucces=function(file){
      forge.file.URL(file, function (url) {
        webdb.addPhoto(day,url, _onAdd, _onError);
      });
    };
    var onError=function(content){
      console.log('error al guardar imagen', content);
    };
    forge.file.getImage({source:'camera'}, onSucces, onError);
  };



}]);