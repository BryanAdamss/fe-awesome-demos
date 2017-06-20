require.config({
    baseUrl: "js",
    paths: {
        lib: "lib",
        vendor: "vendor",
        jquery: "lib/jquery-1.12.4.min",
        domReady: "lib/domReady",
        ruler: "vendor/02_ruler"
    }
});
require(['jquery', 'ruler'], function($, ruler) {
    $("#cgh-Ruler").cgh_Ruler({ // 调用
        initTime: new Date(),
        clickHandler: function(time) {
            console.log(time);
            alert('click');
        },
        changeHandler: function(time, lastTime) {
            console.log(time, lastTime);
            alert('change');
        }
    });
});
