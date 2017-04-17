require.config({
    baseUrl: "js",
    paths: {
        lib: "lib",
        vendor: "vendor"
    }
});
require(["vendor/00_placeholder"], function(Pler) {
    // 注意执行到这时,window.onload已经触发过了，所以回调中的onload事件就不会再触发了
    var pl = new Pler();
    pl.init();
});
