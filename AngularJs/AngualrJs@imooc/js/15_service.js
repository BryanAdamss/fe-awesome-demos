var myServiceApp = angular.module("MyServiceApp", []);
myServiceApp.factory('userListService', ['$http',
    function($http) {
        var doRequest = function(username, path) {
            return $http({
                method: 'GET',
                url: 'users.json'
            });
        }
        return {
            userList: function(username) {
                return doRequest(username, 'userList');
            }
        };
    }
]);

myServiceApp.controller('ServiceController', ['$scope', '$timeout', 'userListService',
    function($scope, $timeout, userListService) {
        var timeout; // 利用超时，防止连续提交
        $scope.$watch('username', function(newUserName) { // $watch用来监控数据模型的变化
            if (newUserName) {
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function() {
                    userListService.userList(newUserName)
                        .success(function(data, status) {
                            $scope.users = data;
                        });
                }, 350);
            }
        });
    }
]);

//下面可能还有很多用到userListService的controller
