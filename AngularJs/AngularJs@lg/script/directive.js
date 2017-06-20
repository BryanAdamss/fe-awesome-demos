angular.module('app').directive('appHead', ['cache', function(cache) {
    return {
        restict: 'A',
        replace: true,
        templateUrl: 'view/template/head.html',
        link: function(scope) {
            scope.name = cache.get('name') || '';
        }
    }
}]);
angular.module('app').directive('appFoot', [function() {
    return {
        restict: 'A',
        replace: true,
        templateUrl: 'view/template/foot.html'
    }
}]);

angular.module('app').directive('appHeadBar', [function() {
    return {
        restict: 'A',
        replace: true,
        templateUrl: 'view/template/headBar.html',
        scope: {
            headTitle: '@'
        },
        link: function(scope, ele, attrs) {
            scope.back = function() {
                window.history.back();
            };
        }
    }
}]);
angular.module('app').directive('appCompanyInfo', [function() {
    return {
        restict: 'A',
        replace: true,
        templateUrl: 'view/template/companyInfo.html',
        scope: {
            com: '='
        }
    }
}]);
angular.module('app').directive('appPositionClass', [function() {
    return {
        restict: 'A',
        replace: true,
        templateUrl: 'view/template/positionClass.html',
        scope: {
            com: '='
        },
        link: function(scope, ele, attrs) {
            scope.showPositionList = function(index) {

                scope.positionList = scope.com.positionClass[index].positionList;
                scope.isActive = index;
            };

            scope.$watch('com', function(newVal) {
                if (newVal) {
                    scope.showPositionList(0);
                }
            });
        }
    }
}]);
angular.module('app').directive('appPositionInfo', ['$http', function($http) {
    return {
        restict: 'A',
        replace: true,
        templateUrl: 'view/template/positionInfo.html',
        scope: {
            isActive: '=',
            isLogin: '=',
            pos: '='
        },
        link: function(scope, ele, attrs) {
            scope.$watch('pos', function(newVal) {
                if (newVal) {
                    scope.pos.select = scope.pos.select || false;
                    scope.imagePath = scope.pos.select ? 'image/star-active.png' : 'image/star.png';
                }
            });

            scope.favorite = function() {
                $http.post('/AngularJs@lg/data/favorite.json', {
                    id: scope.pos.id,
                    select: !scope.pos.select
                }).success(function(resp) {
                    scope.pos.select = !scope.pos.select;
                    scope.imagePath = scope.pos.select ? 'image/star-active.png' : 'image/star.png';
                })
            };
        }
    }
}]);
angular.module('app').directive('appPositionList', ['$http', function($http) {
    return {
        restict: 'A',
        replace: true,
        templateUrl: 'view/template/positionList.html',
        scope: {
            dataSource: '=source',
            filterObj: '=',
            isFavorite: '='
        },
        link: function(scope, ele, attrs) {
            scope.select = function(item) {
                $http.post('/AngularJs@lg/data/favorite.json', {
                    id: item.id,
                    select: !item.select
                }).success(function(resp) {
                    console.log(resp);
                    item.select = !item.select;
                });
            };
        }
    }
}]);
angular.module('app').directive('appTab', [function() {
    return {
        restict: 'A',
        replace: true,
        templateUrl: 'view/template/tab.html',
        scope: {
            list: '=',
            tabClick: '&'
        },
        link: function(scope, ele, attrs) {
            scope.click = function(tab) {
                scope.selectId = tab.id;
                scope.tabClick(tab);
            };
        }
    }
}]);
angular.module('app').directive('appSheet', [function() {
    return {
        restict: 'A',
        replace: true,
        templateUrl: 'view/template/sheet.html',
        scope: {
            list: '=',
            visible: '=',
            select: '&'
        }
    }
}]);
