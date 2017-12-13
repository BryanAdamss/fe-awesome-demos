;
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
})(function($) {
    var settings = { // 默认配置
        height: 400,
        autoPlay: true,
        showPagination: true,
        startIndex: 0,
        autoTime: 2000
    };

    var slider = {}; // 保存轮播运行时的一些参数
    var timer = null; // 全局定时器
    var $config = {}; // 保存配置文件

    function move() { // 单步移动
        slider.listItems.eq(slider.curIndex).fadeIn().siblings().fadeOut();
        if (slider.pageItems) {
            slider.pageItems.eq(slider.curIndex).addClass('is-cur').siblings().removeClass('is-cur');
        }
    }

    function moveLoop() { // 循环移动
        timer = setInterval(function() {
            slider.curIndex++;
            if (slider.curIndex === slider.count) {
                slider.curIndex = 0;
            }
            move();
        }, $config.autoTime);
    }

    $.fn.cgh_carousel = function(options) {
        $config = $.extend({}, settings, options); // 保存配置
        return this.each(function() {
            var $this = $(this), // 每个Banner
                bannerList = $this.find('.cgh_Carousel-list');
            $this.height($config.height); // 设置容器高度
            slider.listItems = bannerList.find('.cgh_Carousel-item');
            slider.count = slider.listItems.length;
            slider.listItems.each(function() {
                var $this = $(this), // 每个list-item
                    src = $this.data('bg');
                $this.css({ // 设置背景
                    backgroundImage: 'url(' + src + ')'
                });
            });
            slider.curIndex = $config.startIndex;
            slider.listItems.eq($config.startIndex).fadeIn().siblings().fadeOut(); // 显示初始图片

            bannerList.on('click', '.cgh_Carousel-item', function() {
                location.href = $(this).data('href');
            });

            if ($config.showPagination === true) { // 生成、显示pagination并绑定事件
                var page = $('<div class="cgh_Carousel-pagination"></div>');
                for (var i = 0, span = ''; i < slider.count; i++) {
                    if (i === $config.startIndex) {
                        span += '<span class="cgh_Carousel-paginationItem is-cur"></span>';
                        slider.curIndex = i;
                        continue;
                    }
                    span += '<span class="cgh_Carousel-paginationItem"></span>';
                }
                page.html($(span));
                bannerList.after(page);
                page.css({ // 设置居中
                    marginLeft: -(page.width() / 2) + 'px'
                });
                slider.pageItems = $('.cgh_Carousel-paginationItem')
                page.on('click', '.cgh_Carousel-paginationItem', function() {
                    clearInterval(timer);
                    var $this = $(this), // pageItem
                        index = $this.index();
                    slider.curIndex = index;
                    move();
                    moveLoop();
                });
            }

            if ($config.autoPlay === true) {
                moveLoop();
            }
        });
    };
});