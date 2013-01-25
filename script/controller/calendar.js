angular.module('app').controller('calendar',['$rootScope', '$scope', 'webdb', function(rootScope, scope, webdb){

  var WEEK_DAY_NAME = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  var MONTH_DAY_NAME = ['Enero','Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre','Diciembre'];
  var enero = [
    {dayId:'28/01', dayWeek:0, dayMonth:28, month:1, year:2012},
    {dayId:'29/01', dayWeek:1, dayMonth:29, month:1, year:2012},
    {dayId:'30/01', dayWeek:2, dayMonth:30, month:1, year:2012}
  ];
  var febrero = [
    {dayId:'01/02', dayWeek:3, dayMonth:1,  month:2, year:2012},
    {dayId:'02/02', dayWeek:4, dayMonth:2,  month:2, year:2012},
    {dayId:'03/02', dayWeek:5, dayMonth:2,  month:2, year:2012},
    {dayId:'04/02', dayWeek:6, dayMonth:2,  month:2, year:2012},
    {dayId:'05/02', dayWeek:0, dayMonth:2,  month:2, year:2012},
    {dayId:'06/02', dayWeek:1, dayMonth:2,  month:2, year:2012},
    {dayId:'07/02', dayWeek:2, dayMonth:2,  month:2, year:2012}
  ];
  var listItemWithDay={};

  var init = function(){
    scope.WEEK_DAY_NAME = WEEK_DAY_NAME;
    scope.MONTH_DAY_NAME = MONTH_DAY_NAME;
    scope.enero = enero;
    scope.febrero = febrero;
    scope.listItemWithDay = listItemWithDay;
    scope.dayHasItem = dayHasItem;
    scope.toggleClassIfHasDay = toggleClassIfHasDay;

    scope.toggleIfDayHasItem = toggleIfDayHasItem;

    listItemWithDay = _getListItemWithDay();

    rootScope.$on('addItem', function(){
      listItemWithDay = _getListItemWithDay();
    });

  };

  var dayHasItem = function(day){
    return listItemWithDay[day] || false;
  };

  var toggleClassIfHasDay = function(day){
    return dayHasItem(day)? 'arrow' : 'light';
  };

  var toggleIfDayHasItem = function(day, trueValue, falseValue){
    return dayHasItem(day) ? trueValue : falseValue;
  };

  var _getListItemWithDay = function(){
    var obj = {note:{},photo:{},position:{}};
    webdb.getNoteDaysWithItems( _loadDaysInObjectAndApply(obj.note, obj) );
    webdb.getPositionDaysWithItems( _loadDaysInObjectAndApply(obj.position, obj) );
    webdb.getPhotoDaysWithItems( _loadDaysInObjectAndApply(obj.photo, obj) );
    return obj;
  };
  var _loadDaysInObjectAndApply = function(to1, to2){
    var out = function(tx,rs){
      var rows = rs.rows;
      var n = rows.length;
      var day;
      while(n--){
        day = rows.item(n).day;
        to1[day]=true;
        to2[day]=true;
      }
      scope.$apply(_apply);
    };

    return out;
  };

  var _apply = function(){
    scope.listItemWithDay = listItemWithDay;
  };
  init();
}]);