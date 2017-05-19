console.log(angular.injector());
var myModule = angular.module("MyModule", []);
myModule.filter('filter1', function() {
    return function(item) {
        return item + '...........我是后来追加的';
    }
});
