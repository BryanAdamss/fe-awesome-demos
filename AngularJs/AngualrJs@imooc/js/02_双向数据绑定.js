var userInfoModule = angular.module("UserInfoModule", []);
userInfoModule.controller("UserInfoCtrl", ["$scope", function($scope) {
    $scope.userInfo = {
        email: "test@qq.com",
        password: "testPassword",
        autoLogin: true
    };
    $scope.getFormData = function() {
        console.log($scope.userInfo);
    };
    $scope.setFormData = function() {
        $scope.userInfo = {
            email: "anotherEmail@qq.com",
            password: "testAnother",
            autoLogin: false
        };
    };
    $scope.resetFormData = function() {
        $scope.userInfo = {
            email: "test@qq.com",
            password: "testPassword",
            autoLogin: true
        };
    };
}]);
