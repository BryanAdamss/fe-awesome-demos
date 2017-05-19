var myModule = angular.module("MyModule", []);
myModule.directive("hello", function() {
    return {
        restrict: "AEMC", // 匹配模式，一共有A(attribute)、E(element)、M(comment)、C(class)，可匹配一个，也可一次匹配多个;默认是A，一般常用的是A和E
        template: '<h1>这是由指令生成的</h1>', // 如果模板内容太多，可以单独编写成一个.html文件，然后用templateUrl引入
        // templateUrl:"test.html",
        replace: true
    }
});
