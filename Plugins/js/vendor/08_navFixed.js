;
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
})(function($) {
    var settings = {},
        $config = null;

    $.fn.cgh_navfixed = function(options) {
        $config = $.extend({}, settings, options); // 保存配置
        return this.each(function() {
            var $this = $(this),
                $win = $(window),
                _navOffsetTop = $this.offset().top,
                _scrollPos = -1,
                _temp = $('<div class="cgh_navTemp"></div>'),
                _isFixed = false;

            _temp.css({
                width: $this.width(),
                height: $this.height()
            });

            function scrollHandler() {
                _scrollPos = $win.scrollTop();
                if (_scrollPos >= _navOffsetTop) {
                    if (_isFixed === true) {
                        return;
                    }
                    $this.css({
                        width: $this.width()
                    });
                    $this.addClass('is-fixed');
                    _temp.insertBefore($this);
                    _isFixed = true;
                } else {
                    if (_isFixed === false) {
                        return;
                    }
                    $this.removeClass('is-fixed');
                    $this.prev('.cgh_navTemp').remove();
                    _isFixed = false;
                }
            }

            $win.on('scroll', scrollHandler);
        });
    };
});