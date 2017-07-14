require.config({
    baseUrl: 'js',
    paths: {
        domReady: 'lib/domReady',
        myMove: 'vendor/05_move'
    }
});
define(['domReady!', 'myMove'], function(doc, myMove) {
    var oDiv = doc.querySelector('#js_test'),
        oDiv2 = doc.querySelector('#js_test2'),
        oBtn = doc.querySelector('#js_btn'),
        oBtn2 = doc.querySelector('#js_btn2');

    var move = new myMove(oDiv, {
        'left': 600,
        'opacity': 100
    }, function() {
        console.log('cg');
    });

    var move2 = new myMove(oDiv2, {
        'left': 800,
        'width': 200,
        'opacity': 100
    }, function() {
        console.log('cg');
    });

    oBtn.onclick = function() {
        move.init();
        move2.init();
    };
});
