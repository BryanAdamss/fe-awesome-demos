require.config({
    baseUrl: 'js',
    paths: {
        domReady: 'lib/domReady',
        cgh_navfixed: 'vendor/08_navFixed',
        jquery: 'lib/jquery-1.12.4.min'
    }
});
define(['domReady!', 'cgh_navfixed'], function(doc, cgh_navfixed) {
    $('.Nav').cgh_navfixed();
});