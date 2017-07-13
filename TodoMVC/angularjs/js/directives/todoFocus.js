/*global angular */

/**
 * Directive that places focus on the element it is applied to when the
 * expression it binds to evaluates to true
 */
angular.module('todomvc')
    .directive('todoFocus', function todoFocus($timeout) {
        'use strict';
        return function(scope, elem, attrs) { // 在二次编辑的input上绑定事件
            scope.$watch(attrs.todoFocus, function(newVal, oldVal) {
                // 当双击时，newVal为true
                if (newVal) {
                    $timeout(function() {
                        elem[0].focus();
                    }, 0, false);
                }
            });
        };
    });
