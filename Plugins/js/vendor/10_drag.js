;
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
})(function($) {
    var $doc = $(document);
    /* offsetWidth为content+padding+border
     * clientWidth为content+padding
     * clientLeft为content+padding区域左侧距离content+padding+border区域左侧的距离，一般就是border-left的宽度
     * 所以通过offsetWidth-clientWidth-(clientLeft*2)就可以得到滚动条的宽度
     */
    function getScrollBarW() {
        var testDiv = document.createElement('div');
        testDiv.style.cssText = 'position:absolute;top:0;left:0;z-index:-1;width:30px;height:30px;clip:rect(1px 1px 1px 1px);overflow:scroll;border:1px solid red;';
        document.body.appendChild(testDiv);
        var borderW = testDiv.clientLeft,
            barW = testDiv.offsetWidth - testDiv.clientWidth - (borderW * 2);
        document.body.removeChild(testDiv);
        return barW;
    }

    var settings = {},
        $config = null;
    $.fn.cgh_drag = function(options) {
        $config = $.extend({}, settings, options); // 保存配置
        var barW = getScrollBarW();
        return this.each(function() {
            var $this = $(this),
                hasSetAbs = false, // 是否已经设置绝对定位
                hasSetCursor = false;
            $target = typeof $config.target === 'string' ? $($config.target) : $this;

            $this.on('mouseover.cgh_drag', function() {
                if (!hasSetCursor) {
                    this.style.cursor = 'move';
                    hasSetCursor = true;
                }
            });

            $this.on('mousedown.cgh_drag', function(e) { // 按下
                var $offset = $this.offset(),
                    selfW = $this.outerWidth(), // content+padding+border
                    selfH = $this.outerHeight(),
                    disX = e.pageX - $offset.left, // 鼠标点击位置离左侧的距离
                    disY = e.pageY - $offset.top,
                    docW = $doc.width(),
                    docH = $doc.height();
                if (!hasSetAbs) { // 未设置绝对定位
                    $target.css({
                        transform: 'translateZ(0)',
                        position: 'absolute',
                        zIndex: 9999999
                    });
                    hasSetAbs = true;
                }
                $doc.on('mousemove.cgh_drag', function(e) { // 移动
                    var l = e.pageX - disX,
                        t = e.pageY - disY;

                    if (l < 0) { // 阻止横向溢出
                        l = 0;
                    } else if (l > docW - selfW - barW) {
                        l = docW - selfW - barW;
                    }

                    if (t < 0) { // 阻止纵向溢出
                        t = 0;
                    } else if (t > docH - selfH - barW) {
                        t = docH - selfH - barW;
                    }

                    $target.css({
                        left: l + 'px',
                        top: t + 'px'
                    });
                    return false;
                });

                $doc.on('mouseup.cgh_drag', function(e) { // 释放
                    $doc.off('mousemove.cgh_drag');
                    $doc.off('mouseup.cgh_drag');
                });
                return false;
            });

        });
    };
});