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
    // 工具方法
    var tools = {
        templateEngine: function(html, options) {
            var re = /<@([^@>]+)?@>/g,
                reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
                code = 'var r=[];\n',
                cursor = 0;
            var add = function(line, js) {
                js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                    (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
                return add;
            }
            while (match = re.exec(html)) {
                add(html.slice(cursor, match.index))(match[1], true);
                cursor = match.index + match[0].length;
            }
            add(html.substr(cursor, html.length - cursor));
            code += 'return r.join("");';
            return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
        }
    };

    var Ruler = function(ele, opt) {
        this.elements = ele;
        this.defaults = {
            granularity: 10, // 粒度
            step: 10, // 步长
            startHour: 0, // 刻度尺开始时间
            endHour: 24, // 刻度尺结束时间
            initTime: new Date(), // 初始时间，默认为当前时间
            clickHandler: function() {},
            changeHandler: function() {}
        };
        this.options = $.extend({}, this.defaults, opt);
        this.lastTime = '';
        this.init();
    };

    Ruler.prototype = {
        constructor: Ruler,
        init: function() {
            var that = this;
            return that.elements.each(function() {
                var $this = $(this);
                // 构建数据，创建ruler并追加
                var html = $("#cgh_ruler_tpl").html();
                var data = that.makeData(that.options.startHour, that.options.endHour, that.options.granularity, that.options.step);
                var $ruler = that.makeRuler(html, data);
                $("#cgh-Ruler").append($ruler);
                // 添加初始化时间游标
                var initHour = that.options.initTime.getHours() < 10 ? '0' + that.options.initTime.getHours() : '' + that.options.initTime.getHours();
                var initMin = Math.floor(that.options.initTime.getMinutes() / 10) * 10;
                initMin = initMin < 10 ? '0' + initMin : '' + initMin;
                var time = initHour + ':' + initMin;
                $('[data-time="' + time + '"]').addClass('is-cur');
                that.lastTime = initHour + initMin; // 记录最后时间值
                $(".Ruler-pegWp").on("click", ".Ruler-peg", function() { // 绑定事件
                    var $target = $(this);
                    that.clickHandler($target, that.lastTime);
                });
            });
        },
        clickHandler: function(target, lastTime) {
            $(".Ruler-peg").removeClass("is-cur");
            target.addClass("is-cur");
            var formatTime = target.data('time').replace(':', '');
            this.options.clickHandler(formatTime); // 调用回调，并传入格式化的时间

            if (lastTime !== formatTime) { // 点击不同值时，触发change事件
                this.options.changeHandler(formatTime, lastTime);
            }
            this.lastTime = formatTime;
        },
        makeRuler: function(tplHtml, tplData) {
            return $(tools.templateEngine(tplHtml, tplData));
        },
        makeData: function(start, end, granularity, step) {
            var totalTime = end - start,
                data = [];
            for (var hour = 0; hour < totalTime; hour++) {
                var temp = {};
                var tempTime = [];
                temp.pageNum = hour;
                for (var rule = 0; rule < (60 / granularity); rule++) {
                    var min = rule * granularity;
                    tempTime.push((hour < 10 ? '0' + hour : '' + hour) + ":" + (min < 10 ? "0" + min : '' + min))
                    temp.time = tempTime;
                }
                data.push(temp);
            }
            return data;
        }
    };
    // 向jQuery中被保护的“fn”命名空间中添加插件代码
    $.fn.cgh_Ruler = function(options) {
        //创建实例并返回
        return new Ruler(this, options);
    };
}));