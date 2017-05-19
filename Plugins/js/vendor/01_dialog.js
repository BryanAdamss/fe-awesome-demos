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
        // 默认参数
        pluginName: "myDialog",
        defaults: {
            hasCloseBtn: true,
            title: '标题',
            content: '内容',
            type: "alert",
            onClickOk: function() {},
            onClickCancle: function() {},
            onClose: function() {},
            beforePopUp: function() {}
        },
        // 弹窗模板
        template: {
            alert: '<div class="Dialog"><div class="Dialog-mask"><div class="Dialog-main"><div class="Dialog-hd"><div class="Dialog-title">' +
                '<%this.title%>' +
                '</div><div class="Dialog-close" data-name="close">&times;</div></div><div class="Dialog-bd">' +
                '<%this.content%>' +
                '</div><div class="Dialog-ft "><div class="Dialog-btnG "><a href="javascript:; " class="Dialog-btn" data-name="ok">确定</a><a href="javascript:; " class="Dialog-btn is-cancle" data-name="cancle">取消</a></div></div></div></div></div>'
        },
        // 创建弹窗
        createDialog: function(settings) {
            var sDialog = tools.templateEngine(myPlugin.template[settings.type], {
                title: settings.title,
                content: settings.content
            });
            var $Dialog = $(sDialog);
            return $Dialog;
        }

    };
    // 工具方法
    var tools = {
        // 模板引擎
        templateEngine: function(html, options) {
            var re = /<%([^%>]+)?%>/g,
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

    var Dialog = function(options) {
        this.init(options); // 实例化时就进行初始化操作
    };
    Dialog.prototype = {
        constructor: Dialog,
        init: function(options) {
            var that = this;
            this.settings = { // 合并用户参数和默认参数
                hasCloseBtn: (options && options.hasCloseBtn) || myPlugin.defaults.hasCloseBtn,
                title: (options && options.title) || myPlugin.defaults.title,
                content: (options && options.content) || myPlugin.defaults.content,
                type: (options && options.type) || myPlugin.defaults.type,
                onClickOk: (options && typeof(options.onClickOk) === "function" && options.onClickOk) || myPlugin.defaults.onClickOk,
                onClickCancle: (options && typeof(options.onClickCancle) === "function" && options.onClickCancle) || myPlugin.defaults.onClickCancle,
                onClose: (options && typeof(options.onClose) === "function" && options.onClose) || myPlugin.defaults.onClose,
                beforePopUp: (options && typeof(options.beforePopUp) === "function" && options.beforePopUp) || myPlugin.defaults.beforePopUp,
            };

            var $Dialog = myPlugin.createDialog(this.settings); // 创建窗口

            $Dialog.on("click", ".Dialog-close,.Dialog-btn", function() { // 绑定事件
                var $this = $(this);
                var name = $this.data("name"); // 根据预定义的data-name处理不同事件
                switch (name) {
                    case "ok":
                        console.log("点击了确定按钮");
                        that.settings.onClickOk(); // 调用回调
                        that.close();
                        break;
                    case "cancle":
                        console.log("点击了取消按钮");
                        that.settings.onClickCancle();
                        that.close();
                        break;
                    case "close":
                        console.log("点击了关闭按钮");
                        that.close();
                        break;
                }
            });

            this.$Dialog = $Dialog;
            this.$Dialog.hide(); // 先隐藏
            $("body").append(this.$Dialog); // 再显示
            console.log("Dialog初始化完成");
        },
        popUp: function() {
            this.settings.beforePopUp();
            this.$Dialog.show();
            console.log("Dialog弹出");
        },
        close: function() {
            this.settings.onClose();
            this.$Dialog.hide();
            console.log("Dialog关闭");
        },
        destroy: function() {
            console.log("Dialog被销毁");
        }
    };
    return Dialog;
}));
