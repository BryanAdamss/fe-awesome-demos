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
    /*
     * Tween.js(缓动算法)
     * t: current time（当前时间）；
     * b: beginning value（要动起来的属性的初始值）；
     * c: change in value（变化量，最终值-初始值）；
     * d: duration（动画持续时间）。
     * you can visit 'http://easings.net/zh-cn' to get effect
     */
    var Tween = {
        Linear: function(t, b, c, d) { return c * t / d + b; },
        Quad: {
            easeIn: function(t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOut: function(t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            }
        },
        Cubic: {
            easeIn: function(t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOut: function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        },
        Quart: {
            easeIn: function(t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut: function(t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        Quint: {
            easeIn: function(t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOut: function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        Sine: {
            easeIn: function(t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOut: function(t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOut: function(t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        },
        Expo: {
            easeIn: function(t, b, c, d) {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOut: function(t, b, c, d) {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOut: function(t, b, c, d) {
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        Circ: {
            easeIn: function(t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOut: function(t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOut: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        Elastic: {
            easeIn: function(t, b, c, d, a, p) {
                var s;
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (typeof p == "undefined") p = d * .3;
                if (!a || a < Math.abs(c)) {
                    s = p / 4;
                    a = c;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOut: function(t, b, c, d, a, p) {
                var s;
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (typeof p == "undefined") p = d * .3;
                if (!a || a < Math.abs(c)) {
                    a = c;
                    s = p / 4;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            easeInOut: function(t, b, c, d, a, p) {
                var s;
                if (t == 0) return b;
                if ((t /= d / 2) == 2) return b + c;
                if (typeof p == "undefined") p = d * (.3 * 1.5);
                if (!a || a < Math.abs(c)) {
                    a = c;
                    s = p / 4;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            }
        },
        Back: {
            easeIn: function(t, b, c, d, s) {
                if (typeof s == "undefined") s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut: function(t, b, c, d, s) {
                if (typeof s == "undefined") s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut: function(t, b, c, d, s) {
                if (typeof s == "undefined") s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        Bounce: {
            easeIn: function(t, b, c, d) {
                return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
            },
            easeOut: function(t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOut: function(t, b, c, d) {
                if (t < d / 2) {
                    return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                } else {
                    return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                }
            }
        }
    };

    function MyMove(config) {
        this.target = config.target;
        this.moveQueue = config.moveQueue;
    }

    MyMove.prototype = {
        constructor: MyMove,
        init: function() {
            this.fixRAF();
            this.RAFId = -1;
            this.isEnd = false;
            this.makeRAFLoop(this.makeStep(), this);
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
        getAnimVal: function(t, b, c, d, easing) { // 获取对应时间点，动画的值
            var easingArr = easing.split('.'); // easingArr长度最大为2
            if (easingArr.length === 2) {
                return Tween[easingArr[0]][easingArr[1]](t, b, c, d);
            } else {
                return Tween[easingArr[0]](t, b, c, d);
            }
        },
        setStyle: function(target, attr, value) { // 设置样式
            if (attr === "opacity") { // 透明度样式需要特殊处理
                target.style.filter = "alpha(opacity:" + value + ")";
                target.style.opacity = value / 100;
            } else {
                target.style[attr] = value + "px";
            }
        },
        makeQueue: function() { // 计算产生动画队列
            var that = this;
            var queue = []; // 动画队列
            for (var i = 0, len = that.moveQueue.length, queItem = null; i < len; i++) {
                queItem = that.moveQueue[i];
                var temp = {}; // 保存动画队列的一项
                var tempQue = []; // 保存动画队列每一项的运动参数
                for (var attr in queItem.moveDest) {
                    var tempObj = {}; // 保存需要运动的属性的t,b,c,d以及名称
                    tempObj.time = queItem.time || 0;
                    if (attr === 'opacity') { // opacity特殊处理
                        tempObj.start = Math.round(parseFloat(this.getStyle(this.target, attr)) * 100);
                    } else {
                        tempObj.start = parseInt(this.getStyle(this.target, attr));
                    }
                    tempObj.end = queItem.moveDest[attr];
                    tempObj.changeVal = tempObj.end - tempObj.start;
                    tempObj.duration = queItem.duration || 50;
                    tempObj.prop = attr;
                    // console.log('tempObj', tempObj);
                    tempQue.push(tempObj);
                }
                // console.log('tempQue', tempQue);
                temp.moveParam = tempQue;
                temp.easing = queItem.easing || 'Linear';
                temp.callback = queItem.callback;
                temp.isAllParamStop = false; // 动画的每个属性是否都已运动完成
                // console.log('temp', temp);
                queue.push(temp);
            }
            return queue;
        },
        makeStep: function() { // 实现动画及缓动效果，其实就是raf的每一帧动画
            var that = this;
            var queue = that.makeQueue();
            var len = queue.length;
            that.cur = 0; // 队列中当前正在执行的动画索引
            return function() { // 每次raf都会调用一次
                // console.count('count');
                que = queue[that.cur]; // 获取执行的动画
                param = que.moveParam;
                if (que.isAllParamStop === false) {
                    for (var j = 0, lenParam = param.length, paramItem = null; j < lenParam; j++) {
                        paramItem = param[j];
                        var value = that.getAnimVal(paramItem.time, paramItem.start, paramItem.changeVal, paramItem.duration, que.easing);
                        console.log(value);
                        if (paramItem.time < paramItem.duration) { // 如果出现一个属性未到达目标点,isAllParamStop为false，否则置为true，开始动画序列中下一个动画
                            paramItem.time++;
                        } else {
                            que.isAllParamStop = true;
                        }

                        that.setStyle(that.target, paramItem.prop, value);
                    }
                } else { // 当前动画的所有属性已经完成，可以进行下一个动画，并调用回调
                    that.cur++;
                    que.callback && que.callback();
                }
                if (that.cur === len) { // 所有动画队列已经完成，返回true，通知清除raf
                    return true;
                } else {
                    return false;
                }
            };
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