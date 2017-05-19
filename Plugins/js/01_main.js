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
require(["dialog"], function(Dialog) {
    var d1 = new Dialog();
    var d2 = new Dialog({
        title: "2222222222",
        onClickOk: function() {
            alert("ok");
        },
        onClickCancle: function() {
            alert("我不想被取消");
        },
        onClose: function() {
            alert("我不想被关闭");
        },
        beforePopUp: function() {
            console.log(this);
        }
    });
    console.log(d1);
    console.log(d2);
    $("#btn").on("click", function() {
        d1.popUp();
    });
    $("#btn2").on("click", function() {
        d2.popUp();
    });
});
