(function(root, moduleName, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return (root[moduleName] = factory(root));
        });
    } else {
        root[moduleName] = factory(root);
    }
}(typeof window !== "undefined" ? window : this, "c_jsonp", function(win) {
    if (typeof Object.assign != 'function') {
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) {
                'use strict';
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) {
                        for (var nextKey in nextSource) {
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }

    function formatParams(obj) { // 格式化参数
        var arr = [];
        for (var key in obj) {
            arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
        return arr.join('&');
    }

    var configs = {
        url: '',
        data: {},
        callbackKey: 'callback', // 和后台约定的确定回调名的key值
        callbackName: ('jsonpCallback' + Math.random()).replace('.', ''), // 默认的随机回调名
        timeout: 3000, // 超时时间
        success: function(resp) { // 会在请求成功时，调用callbackName对应的函数中执行success(为什么不直接执行success是因为，需要在callbackName对应的函数中做一些其他操作，如删除script、清除定时器)
            console.log(resp);
        },
        error: function() { // 请求出错时，会直接调用
            throw new Error('请求出错!');
        },
    };


    function jsonp(options) {
        var settings = Object.assign({}, configs, options);
        if (!settings.url) {
            throw new Error('url必须传入');
            return;
        }

        var params = '';
        // 格式化参数
        if (settings.data) {
            settings.data[settings.callbackKey] = settings.callbackName;
            params = formatParams(settings.data);
        }

        var timer = null;
        // 超时处理
        if (settings.timeout) {
            timer = setTimeout(function() {
                win[settings.callbackName] = null;
                oHead.removeChild(oScript);
                settings.error && settings.error.call(null);
            }, settings.timeout);
        }

        // 创建一个全局回调函数，等待jsonp调用
        window[settings.callbackName] = function(resp) {
            oHead.removeChild(oScript);
            if (timer) {
                clearTimeout(timer);
            }
            window[settings.callbackName] = null;
            settings.success && settings.success.call(null, resp);
        };


        // 创建script并追加到页面上
        var oHead = document.querySelector('head');
        var oScript = document.createElement('script');

        var hasQuestionMark = settings.url.indexOf('?') < 0 ? false : true;

        var src = '';
        if (hasQuestionMark) {
            src = settings.url + params;
        } else {
            src = settings.url + '?' + params;
        }

        oScript.src = src;

        oHead.appendChild(oScript);

    }

    return jsonp;
}));