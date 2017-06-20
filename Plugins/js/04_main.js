require.config({
    baseUrl: "js",
    paths: {
        lib: "lib",
        vendor: "vendor",
        jquery: "lib/jquery-1.12.4.min",
        domReady: "lib/domReady",
        tableSort: "vendor/04_tableSort"
    }
});
require(['jquery', 'tableSort'], function($, tableSort) {
    console.log(tableSort);
});
