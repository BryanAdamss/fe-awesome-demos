;
(function(root, moduleName, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return (root[moduleName] = factory(root));
        });
    } else {
        root[moduleName] = factory(root);
    }
})(this, 'move', function(win) {
    function MyMove(obj, json, fnEnd) {
        this.target = obj;
        this.moveParam = json;
        this.callback = fnEnd;
    }

    MyMove.prototype = {
        constructor: MyMove,
        init: function() {
            this.fixRAF();
            this.RAFId = -1;
            this.isEnd = false;
            this.makeRAFLoop(this.makeStep, this);
        },
        getStyle: function(obj, name) {
            if (obj.currentStyle) {
                return obj.currentStyle[name];
            } else {
                return getComputedStyle(obj, false)[name];
            }
        },
        fixRAF: function() { // raf的兼容处理
            var lastTime = 0,
                vendors = ['webkit', 'moz'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                // 统一前缀
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
                    window[vendors[x] + 'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame) {
                // 不支持则采用setTimeout
                window.requestAnimationFrame = function(callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                    var id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                };
            }
        },
        getNowTime: function() { // 获取当前时间的毫秒数
            if (typeof performance !== 'undefined' && performance.now) {
                return performance.now();
            }
            return Date.now ? Date.now() : (new Date()).getTime();
        },
        makeStep: function() { // 实现动画及缓动效果，其实就是raf的每一帧动画
            var bStop = true; // 判断是否所有属性都运动到目标属性,默认都到达目标
            for (var attr in this.moveParam) { // 遍历json
                var cur = 0;
                if (attr === "opacity") { // 透明度特殊处理
                    cur = Math.round(parseFloat(this.getStyle(this.target, attr)) * 100); // 小数存在误差,所以选择四舍五入
                } else {
                    cur = parseInt(this.getStyle(this.target, attr));
                }
                var speed = (this.moveParam[attr] - cur) / 10;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); // 缓冲运动速度需取整
                if (cur !== this.moveParam[attr]) { // 如果出现一个属性未到达目标点,bStop置false
                    bStop = false;
                }
                if (attr === "opacity") { // 透明度样式需要特殊处理
                    this.target.style.filter = "alpha(opacity:" + (cur + speed) + ")";
                    this.target.style.opacity = (cur + speed) / 100;
                } else {
                    this.target.style[attr] = cur + speed + "px";
                }
            }
            if (bStop) {
                if (this.callback) {
                    this.callback();
                }
                return true;
            } else {
                return false;
            }

        },
        makeRAFLoop: function(stepFn, context) { // 实现raf的循环调用
            (function rafLoop() {
                isEnd = stepFn.call(context);
                RAFId = window.requestAnimationFrame(rafLoop);
                if (isEnd) {
                    window.cancelAnimationFrame(RAFId);
                }
            })()
        }

    };

    return MyMove;
});