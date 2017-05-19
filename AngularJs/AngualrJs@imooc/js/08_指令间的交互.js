var myModule = angular.module("MyModule", []);
myModule.directive("superman", function() {
    return {
        scope: {}, // 独立作用域
        restrict: 'AE',
        controller: function($scope) { // 指令内的controller用来向外面暴露方法以供调用，指令间的交互就是通过它来实现的
            $scope.abilities = [];
            this.addStrength = function() {
                $scope.abilities.push("strength");
            };
            this.addSpeed = function() {
                $scope.abilities.push("speed");
            };
            this.addLight = function() {
                $scope.abilities.push("light");
            };
        },
        link: function(scope, element, attrs) { // link函数一般用来 处理指令内部事务的如绑定事件、操作DOM
            element.addClass('btn btn-primary');
            element.bind("mouseenter", function() {
                console.log(scope.abilities);
            });
        }
    }
});
myModule.directive("strength", function() {
    return {
        require: '^superman', // 表明依赖superman指令
        link: function(scope, element, attrs, supermanCtrl) { // 这里的第四个参数就是superman指令中的controller,angular会帮我们自动注入这个controller
            supermanCtrl.addStrength();
        }
    }
});
myModule.directive("speed", function() {
    return {
        require: '^superman',
        link: function(scope, element, attrs, supermanCtrl) {
            supermanCtrl.addSpeed();
        }
    }
});
myModule.directive("light", function() {
    return {
        require: '^superman',
        link: function(scope, element, attrs, supermanCtrl) {
            supermanCtrl.addLight();
        }
    }
});
