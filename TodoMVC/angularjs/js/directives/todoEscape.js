/*global angular */

/**
 * Directive that executes an expression when the element it is applied to gets
 * an `escape` keydown event.
 */
// esc键绑定事件
// 当按下Escape键时，执行attrs.todoEscape的表达式。
angular.module('todomvc')
    .directive('todoEscape', function() {
        'use strict';
        var ESCAPE_KEY = 27;
        return function(scope, elem, attrs) { // 直接返回一个函数，实际上就是link函数；在link函数中绑定事件

            elem.bind('keydown', function(event) {
                if (event.keyCode === ESCAPE_KEY) { // 按下esc，触发attrs.todoEscape对应的事件
                    scope.$apply(attrs.todoEscape);
                }
            });

            scope.$on('$destroy', function() { // 销毁时，解除绑定
                elem.unbind('keydown');
            });
        };
    });
