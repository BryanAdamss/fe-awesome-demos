var appModule = angular.module('TestFormModule', []);
appModule.controller("TestFormModule", function($scope) {
    $scope.user = {
        userName: 'damoqiongqiu',
        password: ''
    };
    $scope.save = function() {
        alert("保存数据!");
    }
});
