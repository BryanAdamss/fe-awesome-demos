/*
 * 构造函数
 * */
function VQuery(vArg) {
    // 用来保存选中的元素
    this.elements = [];
    switch (typeof vArg) {
        case "function":
            myAddEvent(window, "load", vArg);
            break;
        case "string":
            // 通过第一个字符判断传来的是id还是别的
            switch (vArg.charAt(0)) {
                // id
                case "#":
                    var obj = document.getElementById(vArg.substring(1));
                    this.elements.push(obj)
                    break;
                // class
                case ".":
                    this.elements = getByClass(document, vArg.substring(1));
                    break;
                // tagName
                default:
                    this.elements = document.getElementsByTagName(vArg);
                    break;
            }
            break;
        case "object":
            this.elements.push(vArg);
            break;
    }
}

/*
 * 绑定事件
 * */
function myAddEvent(obj, sEv, fn) {
    if (obj.attachEvent) {
        obj.attachEvent("on" + sEv, function () {
            // ie8下绑定时间时this会自动指向window,须通过call来手动指定this
            if (fn.call(obj) === false) {
                // 阻止冒泡、默认事件
                event.cancelBubble=true;
                return false;
            }

        });
    } else {
        ;
        obj.addEventListener(sEv, function (ev) {
            if (fn.call(obj) === false) {
                // 阻止冒泡、默认事件
                event.cancelBubble=true;
                ev.preventDefault();
            }
        }, false);
    }
}

/*
 *  通过class选择
 * */
function getByClass(oParent, sClass) {
    var aEle = oParent.getElementsByTagName("*");
    var aResult = [];
    for (var i = 0; i < aEle.length; i++) {
        if (aEle[i].className === sClass) {
            aResult.push(aEle[i]);
        }
    }
    return aResult;
}

/*
 *  使用$来选择
 * */
function $(vArg) {
    return new VQuery(vArg);
}

/*
 *  getStyle获取计算后样式
 * */
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    }
    else {
        return getComputedStyle(obj, false)[attr];
    }
}

/*
 *   convertCollect将集合中的元素放到数组中(将集合转换为数组)
 * */
function convertCollect(arr, collect) {
    for (var i = 0; i < collect.length; i++) {
        arr.push(collect[i]);
    }
}

/*
 *   getIndex获取元素在同辈元素中的索引(位置)
 * */
function getIndex(obj) {
    var oBro = obj.parentNode.children;
    for (var i = 0; i < oBro.length; i++) {
        if (oBro[i] === obj) {
            return i;
        }
    }
}
/*
 *   点击事件
 * */
VQuery.prototype.click = function (fn) {
    for (var i = 0; i < this.elements.length; i++) {
        myAddEvent(this.elements[i], "click", fn);
    }
};

/*
 *  show函数
 * */
VQuery.prototype.show = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = "block";
    }
    return this;
};

/*
 *  hide函数
 * */
VQuery.prototype.hide = function () {
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = "none";
    }
    return this;
};

/*
 *  hover函数
 * */
VQuery.prototype.hover = function (fnOver, fnOut) {
    for (var i = 0; i < this.elements.length; i++) {
        myAddEvent(this.elements[i], "mouseover", fnOver);
        myAddEvent(this.elements[i], "mouseout", fnOut);
    }
    return this;
};

/*
 *  css函数
 * */
VQuery.prototype.css = function (attr, value) {
    // 设置
    if (arguments.length === 2) {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].style[attr] = value;
        }
    } else {
        // 获取第一个匹配元素的样式
        if (typeof attr === "string") {
            return getStyle(this.elements[0], attr);
        } else {
            // json设置多个样式
            for (var i = 0; i < this.elements.length; i++) {
                var k = "";
                for (k in attr) {
                    this.elements[i].style[k] = attr[k];
                }
            }
        }

    }
    // 返回选择器,保证能链式调用
    return this;
};

/*
 *  toggle函数
 * */
VQuery.prototype.toggle = function () {
    var _arguments = arguments;
    for (var i = 0; i < this.elements.length; i++) {
        addToggle(this.elements[i]);
    }
    function addToggle(obj) {
        var count = 0;
        myAddEvent(obj, "click", function () {
            _arguments[count % _arguments.length].call(obj);
            count++;
        });
    }

    return this;
};

/*
 *  attr函数
 * */
VQuery.prototype.attr = function (attr, value) {
    // 设置属性
    if (arguments.length === 2) {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i][attr] = value;
        }
    } else {
        // 获取第一个匹配元素的属性
        return this.elements[0][attr];
    }
    return this;
};

/*
 *  eq函数
 * */
VQuery.prototype.eq = function (n) {
    return $(this.elements[n]);
};

/*
 *  find函数
 * */
VQuery.prototype.find = function (str) {
    var aResult = [];
    for (var i = 0; i < this.elements.length; i++) {
        switch (str.charAt(0)) {
            // class
            case ".":
                var aEle = getByClass(this.elements[i], str.substring(1));
                aResult = aResult.concat(aEle);
                break;
            // 标签名
            default:
                var aEle = this.elements[i].getElementsByTagName(str);
                // aResult是集合无concat方法,所以需要convertCollect来转换一下
                // aResult = aResult.concat(aEle);
                convertCollect(aResult, aEle);
                break;
        }
    }
    var newVQ = $();
    newVQ.elements = aResult;
    return newVQ;
};

/*
 *  index函数,获取匹配的第一个元素在同级元素中的索引
 * */
VQuery.prototype.index = function () {
    return getIndex(this.elements[0]);
};

/*
 *   bind绑定函数
 * */
VQuery.prototype.bind = function (sEv, fn) {
    for (var i = 0; i < this.elements.length; i++) {
        myAddEvent(this.elements[i], sEv, fn);
    }
};

/*
 *   extend插件,其实就是给原型上添加一个方法
 * */
VQuery.prototype.extend = function (name,fn) {
   VQuery.prototype[name]=fn;
};

