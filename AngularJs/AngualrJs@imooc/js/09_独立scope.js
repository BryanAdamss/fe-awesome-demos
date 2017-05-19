var myModule = angular.module("MyModule", []);
myModule.directive("hello", function() {
    return {
        restrict: 'AE',
        scope: {}, // 若无此独立作用域，则页面上的hello会共享一个作用域，最后导致的结果就是会相互影响
        template: '<div><input type="text" ng-model="userName"/>{{userName}}</div>',
        replace: true
    }
});
