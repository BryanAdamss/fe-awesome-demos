angular.module('app').factory('cache', ['$cookies', function($cookies) {
    return {
        put: function(key, value) {
            $cookies.put(key, value);
        },
        get: function(key) {
            return $cookies.get(key);
        },
        remove: function(key) {
            return $cookies.remove(key);
        }
    };
}]);
