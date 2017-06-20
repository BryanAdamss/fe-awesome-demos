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
    // 在我们插件容器内，创造一个公共变量来构建一个私有方法
    var myPlugin = {
        pluginName: "cgh-Dialog",
        defaults: {
            hasCloseBtn: true,
            title: '标题',
            content: '内容'
        }
    };
    // 工具方法
    var tools = {
        getSingle: function(fn) { // 管理单例
            var result;
            return function() {
                return result || (result = fn.apply(this, arguments));
            };
        },
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


    // 通过字面量创造一个对象，存储我们需要的公有方法
    var methods = {
        // 在字面量对象中定义每个单独的方法
        init: function(options) {
            // 为了更好的灵活性，对选择器中的每个单独的元素都执行代码
            // each支持链式调用，返回this，所以返回了jQuery对象->被选择元素集合
            // return this.each(function() {
            // 为每个独立的元素创建一个jQuery对象
            var $this = $(this);
            // 尝试去获取绑定在html元素上的settings，如果不存在，则返回“undefined”
            var settings = $this.data(myPlugin.pluginName);
            // 如果获取settings失败，则根据自定义参数options和默认参数default创建它
            if (typeof(settings) === 'undefined') {
                // 通过$.extend合并默认参数和自定义参数，并保留了默认参数
                settings = $.extend({}, myPlugin.defaults, options);
                // 在html元素上保存我们新创建的settings
                $this.data(myPlugin.pluginName, settings);
            } else {
                // 如果我们获取了settings，则将它和options进行合并（这不是必须的，你可以选择不这样做）
                settings = $.extend({}, settings, options);
                // 如果你想每次都保存options，可以添加下面代码：
                $this.data(myPlugin.pluginName, settings);
            }

            // 执行代码




        },
        destroy: function(options) {
            // 对选择器每个元素都执行方法
            return this.each(function() {
                var $this = $(this);
                // 执行代码

                // 删除html元素上保存的插件配置参数
                $this.removeData(myPlugin.pluginName);
            });
        },
        val: function(options) {
            // 这里演示如何返回一个普通值，而不是jQuery对象
            // 这里的代码通过.eq(0)来获取选择器中的第一个元素的，我们或获取它的HTML内容作为我们的返回值
            var someValue = this.eq(0).html();

            // 返回值
            return someValue;
        }

    };

    // 向jQuery中被保护的“fn”命名空间中添加你的插件代码，用“pluginName”作为插件的函数名称
    $.fn[myPlugin.pluginName] = function() {
        // 此函数内this指的是jQuery选择的所有元素集合->jQuery对象
        // 获取我们的方法，遗憾的是，如果我们用function(method){}来实现，这样会毁掉一切的
        var method = arguments[0];
        // 检验方法是否存在
        if (methods[method]) {
            // 如果方法存在，存储起来以便使用
            // 注意：我这样做是为了等下更方便地使用each（）
            method = methods[method];
            // 我们的方法是作为参数传入的，把它从参数列表中删除，因为调用方法时并不需要它
            arguments = Array.prototype.slice.call(arguments, 1);
            // 如果方法不存在，检验对象是否为一个对象（JSON对象）或者method方法没有被传入
        } else if (typeof(method) == 'object' || !method) {
            // 如果我们传入的是一个对象参数，或者根本没有参数，init方法会被调用
            method = methods.init;
        } else {
            // 如果方法不存在或者参数没传入，则报出错误。需要调用的方法没有被正确调用
            $.error('方法 ' + method + ' 不存在');
            return this;
        }
        // 用apply方法来调用我们的方法并传入参数
        return method.apply(this, arguments);
    }
}));
