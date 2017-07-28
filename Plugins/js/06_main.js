require.config({
    baseUrl: 'js',
    paths: {
        domReady: 'lib/domReady',
        myMove: 'vendor/06_move_enhance'
    }
});
define(['domReady!', 'myMove'], function(doc, myMove) {
    var oDiv = doc.querySelector('#js_test'),
        oDiv2 = doc.querySelector('#js_test2'),
        oBtn = doc.querySelector('#js_btn'),
        oBtn2 = doc.querySelector('#js_btn2');

    var move = new myMove({
        target: oDiv,
        moveQueue: [{
            moveDest: {
                left: 200,
                opacity: 100
            },
            easing: 'Back.easeInOut',
            callback: function() {
                console.log('cg');
            }
        }, {
            moveDest: {
                height: 400,
                left: 400 // 上一个动画中也有left，会出错；当前的left会从0开始运动，而不是上一次运动的终点
            },
            easing: 'Back.easeInOut',
            callback: function() {
                console.log('cg2');
            }
        }]
    });


    oBtn.onclick = function() {
        move.init();
    };
});