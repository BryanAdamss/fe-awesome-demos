(function(root, moduleName, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return (root[moduleName] = factory(root));
        });
    } else {
        root[moduleName] = factory(root);
    }
}(typeof window !== "undefined" ? window : this, "c_toucher", function(win) {
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

    var configs = {
        callbacks: {
            start: function(e) {
                console.log('callbacks_start', this, e);
            },
            move: function(e) {
                console.log('callbacks_move', this, e);
            },
            end: function(e) {
                console.log('callbacks_end', this, e);
            },
            tap: function(e) {
                console.log('callbacks_tap', this, e);
            },
            longTap: function(e) {
                console.log('callbacks_longtap', this, e);
            },
            doubleTap: function(e) {
                console.log('callbacks_doubleTap', this, e);
            },
            swipeLeft: function(e) {
                console.log('callbacks_swipeLeft', this, e);
            },
            swipeRight: function(e) {
                console.log('callbacks_swipeRight', this, e);
            },
            swipeUp: function(e) {
                console.log('callbacks_swipeUp', this, e);
            },
            swipeDown: function(e) {
                console.log('callbacks_swipeDown', this, e);
            },
        }
    };

    function getDistance(p1, p2) {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    }

    function swipeDirection(p1, p2) {
        return Math.abs(p1.x - p2.x) >= Math.abs(p1.y - p2.y) ? (p1.x - p2.x > 0 ? 'Left' : 'Right') : (p1.y - p2.y > 0 ? 'Up' : 'Down')
    }

    function Toucher(ele, options) {
        if (!ele) {
            return;
        }
        this.ele = (typeof ele === 'string') ? document.querySelector(ele) : ele;

        this.settings = Object.assign({}, configs, options);
        this.init();
    }

    Toucher.prototype = {
        constructor: Toucher,
        init: function() {
            var self = this;
            this.ele.addEventListener('touchstart', function(e) {
                self.touchstart(e);
            }, false);
            this.ele.addEventListener('touchmove', function(e) {
                self.touchmove(e);
            }, false);
            this.ele.addEventListener('touchend', function(e) {
                self.touchend(e);
            }, false);

        },
        touchstart: function(e) {
            var self = this;

            var point = e.changedTouches[0];
            // 记录触摸开始位置和时间，供后续判断事件类型使用
            this.startPos = {
                x: point.pageX,
                y: point.pageY
            };
            this.startTime = new Date().getTime();

            var callbacks = self.settings.callbacks;

            if (callbacks.start) {
                callbacks.start.call(this.ele, e); // 调用start回调
            }

            if (callbacks.longTap) {
                this.longTapTimeout = setTimeout(function(e) { // 800ms后触发longTap
                    callbacks.longTap.call(this.ele, e);
                }, 800, e);
            }
        },
        touchmove: function(e) {
            var self = this;

            var point = e.changedTouches[0];
            var movePos = {
                x: point.pageX,
                y: point.pageY
            };

            // 位置差值
            var dis = getDistance(this.startPos, movePos);

            var callbacks = self.settings.callbacks;
            if (callbacks.move) {
                callbacks.move.call(this.ele, e);
            }

            // 移动距离大于30，则不是longTap
            if (this.longTapTimeout && dis > 10) {
                clearTimeout(this.longTapTimeout);
            }
        },
        touchend: function(e) {
            var self = this;

            var point = e.changedTouches[0];
            // 记录触摸结束时位置和信息，供判断事件类型用
            var endPos = {
                x: point.pageX,
                y: point.pageY
            };
            var endTime = new Date().getTime();

            // 计算出位置和时间的差值
            var dis = getDistance(this.startPos, endPos);
            var time = endTime - this.startTime;

            var callbacks = self.settings.callbacks;
            if (callbacks.end) {
                callbacks.end.call(this.ele, e);
            }

            // 位置差值<10，持续时间<500，则视为tap
            if (dis < 10 && time < 500) {
                if (callbacks.tap) {
                    callbacks.tap.call(this.ele, e);
                }
                if (this.longTapTimeout) {
                    clearTimeout(this.longTapTimeout);
                }
            }

            // 触摸持续时间<800，则不是longTap，清除相应定时器
            if (this.longTapTimeout && time < 800) {
                clearTimeout(this.longTapTimeout);
            }

            // 偏移位置>10，则视为swipe，计算出swipe方向并调用相应回调
            if (dis > 10) {
                var direct = swipeDirection(this.startPos, endPos);
                var callbacksName = 'swipe' + direct;
                if (callbacks[callbacksName]) {
                    callbacks[callbacksName].call(this.ele, e);
                }
            }

            // 两次触摸结束的时间间隔<300，并位置偏移<10，则视为doubleTap
            if (callbacks.doubleTap) {
                if (this.lastTime && this.lastPos) {
                    if (this.startTime - this.lastTime < 300 && getDistance(this.startPos, this.lastPos) < 10) {
                        callbacks.doubleTap.call(this.ele, e)
                    }
                }
                // 保存当前touchend相关信息，供下次判断doubleTap用
                this.lastTime = this.startTime;
                this.lastPos = this.startPos;
            }
        }
    };
    return Toucher;
}));