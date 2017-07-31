;
(function(root, moduleName, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return (root[moduleName] = factory(root));
        });
    } else {
        root[moduleName] = factory(root)
    }
})(this, 'cgh_timeCountDown', function(win) {
    return function(configs) {
        if (configs.msOffset) { //从服务器和活动开始时间计算出的时间差，必须传入
            var ms = configs.msOffset;
        } else {
            throw new Error('msOffset必须传入');
        }

        var _self = this,
            interval = configs.interval || 1000,
            count = 0,
            startTime = new Date().getTime();

        if (ms >= 0) {
            var timeCounter = setTimeout(countDownStart, interval);
        }

        function countDownStart() {
            count++;
            var offset = new Date().getTime() - (startTime + count * interval);
            var nextTime = interval - offset;
            if (nextTime < 0) {
                nextTime = 0
            };
            ms -= interval;
            if (ms < 0) {
                clearTimeout(timeCounter);
            } else {
                console.log("误差：" + offset + "ms，下一次执行：" + nextTime + "ms后，离活动开始还有：" + ms + "ms");
                configs.callback.call(_self, ms);
                timeCounter = setTimeout(countDownStart, nextTime);
            }
        }
    };
});