/*global angular */

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
angular.module('todomvc', ['ngRoute', 'ngResource'])
    .config(['$routeProvider', function($routeProvider) {
        'use strict';
        var routeConfig = {
            controller: 'TodoCtrl',
            templateUrl: 'todomvc-index.html', // 指定模板
            resolve: {
                store: function(todoStorage) { // 在跳转路由之前载入正确的module
                    // Get the correct module (API or localStorage).
                    return todoStorage.then(function(module) {
                        module.get(); // Fetch the todo records in the background.
                        return module;
                    });
                }
            }
        };
        // 路由跳转
        $routeProvider
            .when('/', routeConfig)
            .when('/:status', routeConfig)
            .otherwise({
                redirectTo: '/'
            });
    }]);
