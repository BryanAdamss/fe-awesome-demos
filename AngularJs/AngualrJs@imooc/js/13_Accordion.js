var expModule = angular.module('expanderModule', [])
expModule.directive('accordion', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: '<div ng-transclude></div>',
        controller: function() {
            var expanders = [];
            this.gotOpened = function(selectedExpander) {
                angular.forEach(expanders, function(expander) {
                    if (selectedExpander != expander) {
                        expander.showMe = false;
                    }
                });
            }
            this.addExpander = function(expander) {
                expanders.push(expander);
            }
        }
    }
});

expModule.directive('expander', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        require: '^?accordion',
        scope: {
            title: '=expanderTitle'
        },
        template: '<div>' + '<div class="title" ng-click="toggle()">{{title}}</div>' + '<div class="body" ng-show="showMe" ng-transclude></div>' + '</div>',
        link: function(scope, element, attrs, accordionController) {
            scope.showMe = false;
            accordionController.addExpander(scope);
            scope.toggle = function toggle() {
                scope.showMe = !scope.showMe;
                accordionController.gotOpened(scope);
            }
        }
    }
});

expModule.controller("SomeController", function($scope) {
    $scope.expanders = [{
        title: '点击展开1',
        text: '内容1'
    }, {
        title: '点击展开2',
        text: '内容2'
    }, {
        title: '点击展开3',
        text: '内容3'
    }];
});
