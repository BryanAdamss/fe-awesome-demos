require.config({
    baseUrl: 'js/vendor',
    paths: {
        lib: '../lib',
        jquery: '../lib/jquery-1.12.4.min',
        domReady: '../lib/domReady',
        template: '00_template',
        cgh: '../lib/amNotAMD'
    },
    shim: {
        cgh: {
            deps: [],
            exports: 'person'
        }
    },
    enforceDefine: true // 为true时，所有模块必须用define定义或者可用shim配置，main.js也一样，所以下面的require形式会报错，必须改写为define形式
});

// require(["template"], function(template) { // 启用enforceDefine后，这样写会报错
//     console.log(template);
// });

define(['domReady!', 'template', 'cgh'], function(doc, tpl, cgh) { // domReady!->注意后面的感叹号，这样写，会让回调函数在DOM准备好后再调用，并将document做为参数传入回调中；这里因为template是一个jQuery插件，并没有返回值，所以没有在回调中接收返回值；cgh(非AMD规范)，通过配置shim来调用。
    console.log(doc, tpl, cgh);
    $('body').template();
});
