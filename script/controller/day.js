angular.module('app').controller('day',['$rootScope', '$scope', 'webdb', 'Twitter',function(rootScope, scope, webdb, Twitter){
  var item = {a:0};
  var init = function(){
    scope.item = item;
    scope.loadTwitts = loadTwitts;

    rootScope.$on('changeCurrentDay', _updateItem);
    rootScope.$on('addItem', _updateItem);
    scope.$on("loadCollectionFromRs", _applyChangeInFront);
  };

  var loadTwitts = function(){
    var day = rootScope.currentDay;
    _loadTwitts(day,item);
  };

  var _updateItem = function(){
    var day = rootScope.currentDay;
    if(day){
      item = _getItem(day);
    }
  };

  var _getItem = function(day){
    var obj = {note:[],photo:[],position:[], twitts:[]};
    webdb.getNoteByDay(day, _loadCollectionFromRs(obj.note) );
    webdb.getPostionByDay(day, _loadCollectionFromRs(obj.position) );
    webdb.getPhotoByDay(day, _loadCollectionFromRs(obj.photo) );
    return obj;
  };

  var _loadCollectionFromRs = function(to){
    var out = function(tx,rs){
      var rows = rs.rows;
      var n = rows.length;
      while(n--){
        to.push(rows.item(n));
      }
      scope.$emit("loadCollectionFromRs");
    };
    return out;
  };

  var _loadTwitts = function(day, to){
    console.log('_loadT');
    Twitter.search({}, function(result) {
      console.log('_loadT sear', result);
      if (result && result.results) {
        to.twitts = result.results;
        if(!scope.$$phase) {
          scope.$emit("loadCollectionFromRs");
        }

      }
    });
  };

  var _applyChangeInFront = function(){
    scope.$apply(_apply);
  };

  var _apply = function(){
    scope.item = item;
  };

  init();

}]);