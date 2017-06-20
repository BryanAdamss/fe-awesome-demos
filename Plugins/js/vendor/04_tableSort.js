;
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // 注册一个依赖jquery的模块
        define(['jquery'], factory);
    } else {
        // 浏览器环境
        factory(jQuery);
    }
}(function($) {
    var $span = $('<span class="SortCursor"></span>');
    var $th = $('th[data-sort]');
    $th.append($span);
    // var $firstTh = $th.parent('tr').find('th[data-sort]:first');
    // $firstTh.addClass('is-up'); // 默认为tr下的第一个th添加升序标识
    var sortedIndex = -1; // 保存上一次排序列的索引
    $th.on('click', function() {
        var $this = $(this);
        $this.siblings('th[data-sort]').removeClass('is-up is-down'); // 移除兄弟元素上的排序标识
        var this_index = $this.index(); // 点击列索引
        var $tbody = $this.parents('table').find('tbody');
        var $trs = $tbody.find('tr');
        if (this_index === sortedIndex) { // 已排过序，直接反转
            $tbody.html($trs.get().reverse());
        } else {
            var now = '',
                next = '',
                temp = null;
            for (var i = 0, len = $trs.length; i < len; i++) {
                for (var j = i + 1; j < len; j++) {
                    now = $($($trs[i]).children('td')[this_index]).html();
                    next = $($($trs[j]).children('td')[this_index]).html();
                    now = now === '' ? '0' : now;
                    next = next === '' ? '0' : next;
                    if (parseFloat(now) > parseFloat(next)) { // 比较值，并替换
                        temp = $trs[i];
                        $trs[i] = $trs[j];
                        $trs[j] = temp;
                    }
                }
            }
            $tbody.html($trs);
            sortedIndex = this_index; // 更新排序列的索引
        }

        if ($(this).hasClass('is-up')) {
            $(this).removeClass('is-up');
            $(this).addClass('is-down');

        } else if ($(this).hasClass('is-down')) {
            $(this).removeClass('is-down');
            $(this).addClass('is-up');

        } else {
            $(this).addClass('is-up');
        }
    });
}));
