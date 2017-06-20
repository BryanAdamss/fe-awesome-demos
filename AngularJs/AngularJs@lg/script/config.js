angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$validationProvider', '$provide', function($stateProvider, $urlRouterProvider, $validationProvider, $provide) {
    // 路由
    $urlRouterProvider.otherwise('main');
    $stateProvider.state('main', {
        url: '/main',
        templateUrl: 'view/main.html',
        controller: 'mainCtrl'
    }).state('position', {
        url: '/position/:id',
        templateUrl: 'view/position.html',
        controller: 'positionCtrl'
    }).state('company', {
        url: '/company/:id',
        templateUrl: 'view/company.html',
        controller: 'companyCtrl'
    }).state('search', {
        url: '/search',
        templateUrl: 'view/search.html',
        controller: 'searchCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: 'view/login.html',
        controller: 'loginCtrl'
    }).state('register', {
        url: '/register',
        templateUrl: 'view/register.html',
        controller: 'registerCtrl'
    }).state('me', {
        url: '/me',
        templateUrl: 'view/me.html',
        controller: 'meCtrl'
    }).state('favorite', {
        url: '/favorite',
        templateUrl: 'view/favorite.html',
        controller: 'favoriteCtrl'
    }).state('post', {
        url: '/post',
        templateUrl: 'view/post.html',
        controller: 'postCtrl'
    });
    // 验证
    var expression = {
        phone: /^1[\d]{10}$/,
        password: function(value) {
            value = value + '';
            return value.length > 5;
        },
        required: function(value) {
            return !!value;
        }
    };
    var defaultMsg = {
        phone: {
            success: '',
            error: '必须是11位手机号'
        },
        password: {
            success: '',
            error: '长度至少6位'
        },
        required: {
            success: '',
            error: '必填项'
        }
    };
    $validationProvider.setErrorHTML(function(msg) {
        return '<div class="Totast">' + msg + '</div>';
    });
    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
    // $validationProvider.setValidMethod('submit-only');

    // 修饰http
    $provide.decorator('$http', ['$delegate', '$q', function($delegate, $q) {

        $delegate.post = function(url, data, config) {
            var def = $q.defer();
            $delegate.get(url).success(function(resp) {
                def.resolve(resp);
            }).error(function(err) {
                def.reject(err);
            });
            return {
                success: function(cb) {
                    def.promise.then(cb);
                },
                error: function(cb) {
                    def.promise.then(null, cb);
                }
            };
        };
        return $delegate;
    }]);
}]);


angular.module('app').value('dict', {}).run(['$http', 'dict', function($http, dict) {
    $http.get('/AngularJs@lg/data/city.json').success(function(resp) {
        dict.city = resp;
    });
    $http.get('/AngularJs@lg/data/salary.json').success(function(resp) {
        dict.salary = resp;
    });
    $http.get('/AngularJs@lg/data/scale.json').success(function(resp) {
        dict.scale = resp;
    });
}]);
