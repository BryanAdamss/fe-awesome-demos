require.config({
    baseUrl: 'js',
    paths: {
        domReady: 'lib/domReady',
        cgh_timeCountDown: 'vendor/09_timeCountDown',
    }
});
define(['domReady!', 'cgh_timeCountDown'], function(doc, cgh_timeCountDown) {
    //继续线程占用
    setInterval(function() {
        var j = 0;
        while (j++ < 9999999);
    }, 0);

    cgh_timeCountDown({
        interval: 1000,
        msOffset: 5000,
        callback: function(ms) {
            console.log('离活动开始还有:', ms, 'ms');
        }
    });

});