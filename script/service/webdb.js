angular.module('app').service('webdb', [function(){
  var query = {
    CREATE_TABLE_TEMPLATE : "CREATE TABLE IF NOT EXISTS {{name}}(ID INTEGER PRIMARY KEY ASC, {{rows}},added_on DATETIME)",
    INSERT:"INSERT INTO {{table}}({{rows}}) VALUES (?,?,?)",
    SELECT_BY_DAY: "SELECT * FROM {{table}} WHERE day=?",
    SELECT_ALL: "SELECT * FROM {{table}}",
    SELECT_GROUP_DAY: "SELECT day FROM {{table}} GROUP BY day"
  };
  var table = {
    NOTE:"note",
    PHOTO:"photo",
    POSITION:"position"
  };

  //*******
  //  DB
  //*******

  var db = null;

  var _open = function() {
    var dbSize = 5 * 1024 * 1024; // 5MB
    db = openDatabase("diarIO", "0.1", "Diario of your live", dbSize);
  };

  var _createTables = function() {
    db.transaction(function(tx) {
      tx.executeSql( _makeQueryNewTable(table.NOTE, "day VARCHAR(32), note TEXT") );
      tx.executeSql( _makeQueryNewTable(table.PHOTO, "day VARCHAR(32), uri TEXT") );
      tx.executeSql( _makeQueryNewTable(table.POSITION, "day VARCHAR(32), latlng VARCHAR(32)") );
    });
  };

  var _transaction = function(query, data, onSucces, onError){
    return db.transaction(function(tx){
      tx.executeSql(query, data, onSucces, onError);
    });
  };

  //*******
  //  TOOLS
  //*******

  var _makeQueryNewTable = function(name, rows){
    return query.CREATE_TABLE_TEMPLATE.replace("{{name}}", name).replace("{{rows}}", rows);
  };
  var _makeQueryInsert = function(table, rows){
    rows = rows.join(',');
    return query.INSERT.replace("{{table}}", table).replace("{{rows}}", rows);
  };
  var _makeQueryInsertByDay = function(table){
    return query.SELECT_BY_DAY.replace("{{table}}", table);
  };
  var _makeQueryDaysWithItems = function(table) {
    return query.SELECT_GROUP_DAY.replace("{{table}}", table);
  };

  //**********
  //  PUBLIC
  //**********

  var fn = {};
  fn.addNote = function(day, note, onSucces, onError){
    var addedOn   = new Date();
    var rows      = ["day", "note", "added_on"];
    var q         = _makeQueryInsert(table.NOTE, rows);
    var data      = [day,note,addedOn];
    _transaction(q, data, onSucces, onError);
  };
  fn.addPosition = function(day, latlng, onSucces, onError){
    var addedOn   = new Date();
    var rows      = ["day", "latlng", "added_on"];
    var q         = _makeQueryInsert(table.POSITION, rows);
    var data      = [day,latlng,addedOn];
    _transaction(q, data, onSucces, onError);
  };
  fn.addPhoto = function(day,uri, onSucces, onError){
    var addedOn = new Date();
    var rows    = ["day", "uri", "added_on"];
    var q       = _makeQueryInsert(table.PHOTO, rows);
    var data    = [day,uri,addedOn];
    _transaction(q, data, onSucces, onError);
  };

  fn.getNoteByDay = function(day, renderFunc, onError){
    var q = _makeQueryInsertByDay(table.NOTE);
    _transaction(q, [day], renderFunc, onError);
  };
  fn.getPostionByDay = function(day, renderFunc, onError){
    var q = _makeQueryInsertByDay(table.POSITION);
    _transaction(q, [day], renderFunc, onError);
  };
  fn.getPhotoByDay = function(day, renderFunc, onError){
    var q = _makeQueryInsertByDay(table.PHOTO);
    _transaction(q, [day], renderFunc, onError);
  };

  fn.getNoteDaysWithItems = function(renderFunc, onError){
    var q = _makeQueryDaysWithItems(table.NOTE);
    _transaction(q, [], renderFunc, onError);
  };
  fn.getPositionDaysWithItems = function(renderFunc, onError){
    var q = _makeQueryDaysWithItems(table.POSITION);
    _transaction(q, [], renderFunc, onError);
  };
  fn.getPhotoDaysWithItems = function(renderFunc, onError){
    var q =  _makeQueryDaysWithItems(table.PHOTO);
    _transaction(q, [], renderFunc, onError);
  };


  _open();
  _createTables();
  return fn;

}]);
