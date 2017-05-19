require.config({
    baseUrl: "js",
    paths: {
        lib: "lib",
        vendor: "vendor",
        jquery: "lib/jquery-1.12.4.min",
        domReady: "lib/domReady",
        dialog: "vendor/01_dialog"
    }
});
require(["dialog"], function(dialog) {
    $("#btn").on("click", function() {
        var dialog = $(this).myDialog({
            title: '我是测试标题',
            content: '我是测试内容'
        });
        console.log(new dialog());
    });
});
