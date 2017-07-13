/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
    .controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter, store) {
        'use strict';

        var todos = $scope.todos = store.todos; // 从localStorge中取出所有todo

        $scope.newTodo = ''; // 用来保存新创建的todo
        $scope.editedTodo = null; // 用来保存编辑过的todo

        $scope.$watch('todos', function() { // 深度观察todos的值
            $scope.remainingCount = $filter('filter')(todos, { completed: false }).length; // 更新未完成的todo数量
            $scope.completedCount = todos.length - $scope.remainingCount; // 更新完成的todo数量
            $scope.allChecked = !$scope.remainingCount; // 是否全部完成
        }, true);

        // Monitor the current route for changes and adjust the filter accordingly.
        $scope.$on('$routeChangeSuccess', function() { // 观察路由跳转，并更新用来过滤的statusFilter
            var status = $scope.status = $routeParams.status || '';
            $scope.statusFilter = (status === 'active') ? { completed: false } : (status === 'completed') ? { completed: true } : {};
        });

        $scope.addTodo = function() { // 输入框提交时触发
            var newTodo = { // 创建新todo
                title: $scope.newTodo.trim(), //newTodo是绑定在input输入框上
                completed: false
            };

            if (!newTodo.title) { // 空值，则不提交
                return;
            }

            $scope.saving = true; // saving用来标识input的禁用状态，为true则禁用

            store.insert(newTodo) // 插入新todo
                .then(function success() { // 成功则重置newTodo
                    $scope.newTodo = '';
                })
                .finally(function() {
                    $scope.saving = false; // 最后取消input的禁用状态
                });
        };

        $scope.editTodo = function(todo) { // 已添加的todo上双击时触发，会将双击的todo传入
            $scope.editedTodo = todo; // 保存正在编辑的todo
            // Clone the original todo to restore it on demand.
            $scope.originalTodo = angular.extend({}, todo); // 保留原先的todo，以备不时之需
        };

        $scope.saveEdits = function(todo, event) { // 再编辑input提交或者blur时触发
            // Blur events are automatically triggered after the form submit event.
            // This does some unfortunate logic handling to prevent saving twice.
            if (event === 'blur' && $scope.saveEvent === 'submit') { // 提交时，会自动触发一次blur，所以手动阻止
                $scope.saveEvent = null;
                return;
            }

            $scope.saveEvent = event; // 保存事件类型(blur或submit)

            if ($scope.reverted) { // 如果编辑后按esc，取消了编辑，则不保存
                // Todo edits were reverted-- don't save.
                $scope.reverted = null;
                return;
            }

            todo.title = todo.title.trim(); // 保存新编辑title

            if (todo.title === $scope.originalTodo.title) { // title未发生改变，则不保存
                $scope.editedTodo = null;
                return;
            }

            store[todo.title ? 'put' : 'delete'](todo)
                .then(function success() {}, function error() { // 保存出错，则恢复title
                    todo.title = $scope.originalTodo.title;
                })
                .finally(function() { // 最后，重置editedTodo
                    $scope.editedTodo = null;
                });
        };

        $scope.revertEdits = function(todo) { // todoEscape时触发，将再编辑input恢复到编辑前的状态，会传入需要恢复的todo
            todos[todos.indexOf(todo)] = $scope.originalTodo;
            $scope.editedTodo = null;
            $scope.originalTodo = null;
            $scope.reverted = true;
        };

        $scope.removeTodo = function(todo) { // 删除todo
            store.delete(todo);
        };

        $scope.saveTodo = function(todo) { // 保存todo
            store.put(todo);
        };

        $scope.toggleCompleted = function(todo, completed) { // 切换完成状态
            if (angular.isDefined(completed)) { // 如果completed曾经定义过，则直接使用
                todo.completed = completed;
            }

            // 更新localStorge上的todo的complete
            store.put(todo, todos.indexOf(todo))
                .then(function success() {}, function error() { // 保存出错，则恢复
                    todo.completed = !todo.completed;
                });
        };

        $scope.clearCompletedTodos = function() { // 清除所有已经完成的todo
            store.clearCompleted();
        };

        $scope.markAll = function(completed) { // 将所有todo置为已完成
            todos.forEach(function(todo) {
                if (todo.completed !== completed) {
                    $scope.toggleCompleted(todo, completed);
                }
            });
        };
    });
