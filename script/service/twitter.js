angular.module('app').factory('Twitter', ['$resource',function($resource) {
  return $resource('http://search.twitter.com/search.json',
      {callback: 'JSON_CALLBACK'}, {
        search: {
          method:'JSONP',
          params: {
            q:'from:telefonicaid',
            result_type: 'recent',
            rpp: 25
          },
          isArray:false
        }
      });
  }
]);