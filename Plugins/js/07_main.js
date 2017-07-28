require.config({
    baseUrl: 'js',
    paths: {
        domReady: 'lib/domReady',
        myCarousel: 'vendor/07_carousel',
        jquery: 'lib/jquery-1.12.4.min'
    }
});
define(['domReady!', 'myCarousel'], function(doc, myCarousel) {
    $('.cgh_Carousel').cgh_carousel({
        height: 380,
        autoPlay: true,
        showPagination: true,
        startIndex: 0,
        autoTime: 3000
    });
});