var helloModule = angular.module("HelloAngular", []); // 实例化一个名为HelloAngualr的模块
helloModule.controller("helloNgCtrl", ["$scope", function($scope) { // 为此模块添加一个controller
    $scope.greeting = {
        text: "Hello"
    };
}]);
