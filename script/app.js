if(window['forge']) forge.enableDebug();
angular.module('app', ['lungo', 'ngResource']).
  value('quo', Quo).
  value('forge', window['forge'] || {});