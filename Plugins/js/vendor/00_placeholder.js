(function(root, moduleName, factory) {
    // moduleName为模块名，最好和文件名保持一致
    if (typeof define === 'function' && define.amd) {
        // 注册一个无依赖的模块，并导入全局变量
        define([], function() {
            return (root[moduleName] = factory(root));
        });
    } else {
        // 在全局环境上添加一个全局变量
        root[moduleName] = factory(root);
    }
}(typeof window !== "undefined" ? window : this, "MyPlaceholder", function(win) {
    // 你的代码
    var Tool = function() {};
    Tool.prototype = {
        constructor: Tool,
        getPagePos: function(domObj) { // 获取元素相对文档的位置
            var rect = domObj.getBoundingClientRect();
            return {
                top: rect.top + (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
                left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0),
                width: rect.right - rect.left,
                height: rect.bottom - rect.top
            };
        },
        isSupport: function(attr, domObjStr) { // 判断是否支持某特性
            return attr in document.createElement(domObjStr);
        },
        getComputedCss: function(domObj, attr) { // 获取计算后的样式
            if (typeof window.getComputedStyle !== "undefined") {
                return window.getComputedStyle(domObj, null)[attr];
            } else if (typeof domObj.currentStyle !== "undefined") {
                return domObj.currentStyle[attr];
            }
        },
        show: function(domObj) { // 显示
            domObj.style.display = domObj.displayState;
        },
        hide: function(domObj) { // 隐藏前先保存原先display值
            domObj.displayState = this.getComputedCss(domObj, "display");
            domObj.style.display = "none";
        }
    };

    var tool = new Tool();

    var Placeholder = function(options) {
        this.config = {
            CSS_SPAN: 'position:absolute;z-index:2;color:#666;font-size:80%;box-sizing:border-box;' // span的基本样式
        };
        this.setting = options || this.config;
    };

    Placeholder.prototype = {
        constructor: Placeholder,
        createSpan: function(pos) { // 创建span，并设置基本样式
            var span = document.createElement("span");
            span = document.createElement("span");
            span.style.cssText += ";" + this.setting.CSS_SPAN;
            span.style.cssText += ";" + "top:" + pos.top + "px;" + "left:" + pos.left + "px;" + "width:" + pos.width + "px;" + "height:" + pos.height + "px;";
            return span;
        },
        init: function() {
            if (!tool.isSupport("placeholder", "input")) { // 不支持时创建span模拟placeholder
                var aField = document.querySelectorAll('input[type="text"],input[type="password"],textarea'),
                    oSpan = null,
                    oPos = null,
                    oField = null;
                for (var i = 0, len = aField.length; i < len; i++) {
                    oField = aField[i];
                    aField[i].value = ""; // 清除IE刷新时保留的值
                    oPos = tool.getPagePos(oField); // 获取input的位置信息
                    oSpan = this.createSpan(oPos); // 创建并设置span的位置信息和基本样式
                    if (!("cols" in oField)) { // 排除textarea，并设置input行高
                        oSpan.style.lineHeight = oPos.height + "px";
                    }
                    oSpan.innerHTML = oField.getAttribute("placeholder"); // 设置span内部值
                    oSpan.onclick = (function(oInput) { // span点击时，input聚焦
                        return function() {
                            oInput.focus();
                        };
                    }(oField));
                    oField.onblur = (function(oCover) { // 失焦时显示span
                        return function() {
                            if (this.value === "") {
                                tool.show(oCover);
                            }
                        };
                    }(oSpan));
                    oField.onfocus = (function(oCover) { // 聚焦时隐藏span
                        return function() {

                            if (this.value === "") {
                                tool.hide(oCover);
                            }
                        };
                    }(oSpan));
                    document.body.appendChild(oSpan); // 追加到body上
                }
            }
        }
    };
    // 导出值，可以是对象，也可以是函数
    return Placeholder;
}));
