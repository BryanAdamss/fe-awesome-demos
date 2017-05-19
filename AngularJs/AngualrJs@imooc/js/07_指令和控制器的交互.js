var myModule = angular.module("MyModule", []);
myModule.controller("MyCtrl", ["$scope", function($scope) {
    $scope.loadData = function() {
        console.log("数据正在加载中...");
    };
}]);
myModule.controller("MyCtrl2", ["$scope", function($scope) {
    $scope.loadData2 = function() {
        console.log("数据正在加载中...22222222222");
    };
}]);
myModule.directive("loader", function() {
    return {
        restrict: "AE",
        link: function(scope, element, attr) { // 在link过程中绑定事件
            element.bind("mouseover", function() {
                // scope.loadData();// 调用loadData方法
                // scope.$apply("loadData()"); // 通过$apply来调用,$apply内部传入的是调用方法的字符串
                scope.$apply(attr.howtoload); // 注意，小坑。如果在html中属性是驼峰写法，则在angular中必须全是小写
            })
        }
    }
});
