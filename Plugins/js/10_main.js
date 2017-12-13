require.config({
    baseUrl: 'js',
    paths: {
        domReady: 'lib/domReady',
        jquery: 'lib/jquery-1.12.4.min',
        cgh_drag: 'vendor/10_drag'
    }
});
define(['domReady!', 'cgh_drag'], function(doc, cgh_drag) {
    $('#js_hd').cgh_drag({
        target: '#js_box'
    });
});