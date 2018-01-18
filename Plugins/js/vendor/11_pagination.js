(function(root, moduleName, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return (root[moduleName] = factory(root));
        });
    } else {
        root[moduleName] = factory(root);
    }
}(typeof window !== "undefined" ? window : this, "c_Pagination", function(win) {
    if (typeof Object.assign != 'function') {
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) {
                'use strict';
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) {
                        for (var nextKey in nextSource) {
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }

    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function(predicate) {
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                var len = o.length >>> 0;

                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                var thisArg = arguments[1];

                var k = 0;

                while (k < len) {
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }
                    k++;
                }

                return -1;
            }
        });
    }

    if (!Number.isInteger) {
        Number.isInteger = function(value) {
            return typeof value === "number" &&
                isFinite(value) &&
                Math.floor(value) === value;
        };
    }

    function isArray(arr) {
        if (Array.isArray) {
            return Array.isArray(arr);
        } else {
            return Object.prototype.toString.call(arr) === '[object Array]';
        }
    }

    function addEvent(ele, type, handler) {
        if (ele.addEventListener) {
            ele.addEventListener(type, handler, false);
        } else if (ele.attachEvent) {
            ele.attachEvent("on" + type, handler);
        } else {
            ele["on" + type] = handler;
        }
    }

    var configs = {
        skin: '',
        totalCount: 1, //总条数，一般从回调函数中获取。如果没有数据则默认为1条
        curPage: 1, //初始化时的默认选中页，默认第一页。如果所填范围溢出或者非数字或者数字字符串，则默认第一页
        pageShowCount: 5, //分页栏显示的数量
        pageSizeList: [5, 10, 15, 20, 25, 30], //自定义pageSize，默认[5,10,15,20,50]
        defaultPageSize: 5, //默认选中的分页数,默认选中第一个。如果未匹配到数组或者默认数组中，则也为第一个
        showJump: false, //是否包含跳转功能，默认false
        showPageSizeSelector: false, //是否显示分页下拉选择，默认false
        showPN: true, //是否显示上一页和下一页，默认true
        showFL: false, //是否显示首页和末页，默认false
        callback: function(curPage, pageSize, ele) { //跳转的回调，带回当前页、每页大小以及点击跳转时的点击元素(如果不是点击，则ele为空)；this指向分页实例，可通过这个获取分页实例的相关参数；
            console.log(this, curPage, pageSize, ele);
        }
    };

    function Pagination(id, options) {
        if (typeof id === 'undefined' || typeof id !== 'string') {
            throw new Error('id必须传入');
        }

        this.container = document.querySelector('#' + id);
        if (this.container === null) {
            throw new Error('container无法找到');
        }

        this.settings = Object.assign({}, configs, options);
        this.init();
    }

    Pagination.prototype = {
        constructor: Pagination,
        init: function() {
            var that = this;

            this.inputCheck(); // 检查参数正确性

            this.currentPage = this.settings.curPage;
            this.currentPageSize = this.settings.defaultPageSize;

            this.makePaginations();

            this.bindEvent();
        },
        inputCheck: function() {
            if (typeof this.settings.skin !== 'string') {
                throw new Error('skin必须为字符串');
            }

            if (typeof this.settings.totalCount !== 'number' || !Number.isInteger(this.settings.totalCount) || this.settings.totalCount <= 0) {
                throw new Error('totalCount必须为大于0的正整数');
            }

            if (typeof this.settings.curPage !== 'number' || !Number.isInteger(this.settings.curPage) || this.settings.curPage < 1 || this.settings.curPage > Math.ceil(this.settings.totalCount / this.settings.defaultPageSize)) {
                throw new Error('curPage初始页码必须为不能大于最大页码数并不能为0的正整数');
            }

            if (typeof this.settings.pageShowCount !== 'number' || !Number.isInteger(this.settings.pageShowCount) || this.settings.pageShowCount < 1 || this.settings.pageShowCount > Math.ceil(this.settings.totalCount / this.settings.defaultPageSize)) {
                throw new Error('pageShowCount必须为大于0且小于最大页码数的正整数');
            }

            if (!isArray(this.settings.pageSizeList) || this.settings.pageSizeList.length === 0) {
                throw new Error('pageSizeList必须为不为空的数组');
            }


            if (typeof this.settings.defaultPageSize !== 'number' || !Number.isInteger(this.settings.defaultPageSize) || this.settings.defaultPageSize <= 0) {
                throw new Error('defaultPageSize必须为大于0的正整数');
            }

        },
        makePaginations: function() {
            var that = this;

            var wrap = document.createElement('div');
            wrap.className = 'c-Paginations';

            if (this.settings.skin) {
                wrap.className += ' ' + this.settings.skin;
            }

            // 由内往外根据各部件的标志量拼接html
            var html = '<ul class="c-Paginations-list">';
            html += this.makeList() + '</ul>';

            if (this.settings.showPN) {
                var pn = this.makePN();
                html = pn.prev + html;
                html = html + pn.next;
            }

            if (this.settings.showFL) {
                var fl = this.makeFL();
                html = fl.first + html;
                html = html + fl.last;
            }

            html += this.makeTotal();

            html = '<div class="c-Paginations-main">' + html + '</div>';

            if (this.settings.showPageSizeSelector && this.settings.pageSizeList && isArray(this.settings.pageSizeList)) {
                html = this.makeSizeSelect() + html;
            }

            if (this.settings.showJump) {
                html = html + this.makeJump();
            }

            wrap.innerHTML = html;
            this.container.appendChild(wrap);
        },
        makeSizeSelect: function() {
            var that = this;

            var defaultIndex = this.settings.pageSizeList.findIndex(function(val) {
                return val === that.settings.defaultPageSize;
            });
            if (defaultIndex === -1) {
                defaultIndex = 0;
            }

            var html = '<div class="c-Paginations-size"><span>每页显示</span><select class="c-Paginations-select">';

            var options = '';
            for (var i = 0, len = this.settings.pageSizeList.length; i < len; i++) {
                if (i === defaultIndex) {
                    options += '<option value="' + this.settings.pageSizeList[i] + '" selected>' + this.settings.pageSizeList[i] + '</option>';
                    continue;
                }
                options += '<option value="' + this.settings.pageSizeList[i] + '">' + this.settings.pageSizeList[i] + '</option>';
            }

            html += options + '</select></div>';

            return html;
        },
        makeFL: function() {
            var that = this;
            var maxPageNum = Math.ceil(this.settings.totalCount / this.currentPageSize); // 在当前pageSize下计算出来的最大页码数

            var first = '',
                last = '';

            if (this.currentPage === 1) {
                first = '<a href="javascript:;" class="c-Paginations-first is-disabled">首页</a>';
            } else {
                first = '<a href="javascript:;" class="c-Paginations-first">首页</a>';
            }

            if (this.currentPage === maxPageNum) {
                last = '<a href="javascript:;" class="c-Paginations-last is-disabled">末页</a>';
            } else {
                last = '<a href="javascript:;" class="c-Paginations-last">末页</a>';
            }

            return {
                first: first,
                last: last
            };

        },
        makePN: function() {
            var that = this;
            var maxPageNum = Math.ceil(this.settings.totalCount / this.currentPageSize); // 在当前pageSize下计算出来的最大页码数

            var prev = '',
                next = '';

            if (this.currentPage === 1) {
                prev = '<a href="javascript:;" class="c-Paginations-prev is-disabled">上一页</a>';
            } else {
                prev = '<a href="javascript:;" class="c-Paginations-prev">上一页</a>';
            }

            if (this.currentPage === maxPageNum) {
                next = '<a href="javascript:;" class="c-Paginations-next is-disabled">下一页</a>';
            } else {
                next = '<a href="javascript:;" class="c-Paginations-next">下一页</a>';
            }


            return {
                prev: prev,
                next: next
            };

        },
        makeList: function() {
            var that = this;

            var start = this.currentPage - Math.floor(this.settings.pageShowCount / 2);
            start = this.settings.pageShowCount % 2 === 0 ? start + 1 : start; // pageShowCount为偶数，则起始位置加+1，结束位置不变;奇数则起始结束位置都不变
            var end = this.currentPage + Math.floor(this.settings.pageShowCount / 2);
            var maxPageNum = Math.ceil(this.settings.totalCount / this.currentPageSize); // 在当前pageSize下计算出来的最大页码数


            if (start < 1) { // 将计算出来的end右移，并将start置为1
                end = end + (1 - start);
                start = 1;
            }

            if (end > maxPageNum) { // 将计算出来的start左移，并将end置为最大值
                start = start - (end - maxPageNum);
                end = maxPageNum;
            }

            var html = '';
            for (var i = start; i <= end; i++) {
                if (this.currentPage === i) {
                    html += '<li class="c-Paginations-item is-cur"><a href="javascript:;" class="c-Paginations-link" data-val="' + i + '">' + i + '</a></li>';
                    continue;
                }
                html += '<li class="c-Paginations-item"><a href="javascript:;" class="c-Paginations-link" data-val="' + i + '">' + i + '</a></li>';
            }

            return html;
        },
        makeTotal: function() {
            var that = this;
            var maxPageNum = Math.ceil(this.settings.totalCount / this.currentPageSize); // 在当前pageSize下计算出来的最大页码数
            return '<span class="c-Paginations-total">共' + maxPageNum + '页</span>';
        },
        makeJump: function() {
            var that = this;
            return '<div class="c-Paginations-jump"><input type="text" class="c-Paginations-jumpfield"><a href="javascript:;" class="c-Paginations-btn">跳转</a></div>';
        },


        bindEvent: function() {
            var that = this;
            var sizeSelect = document.querySelector('.c-Paginations-select'),
                first = document.querySelector('.c-Paginations-first'),
                last = document.querySelector('.c-Paginations-last'),
                prev = document.querySelector('.c-Paginations-prev'),
                next = document.querySelector('.c-Paginations-next'),
                jumpBtn = document.querySelector('.c-Paginations-btn'),
                list = document.querySelector('.c-Paginations-list');

            if (sizeSelect !== null) {
                addEvent(sizeSelect, 'change', function(e) {
                    var e = e || window.event;
                    var srcEle = e.srcElement ? e.srcElement : e.target;
                    that.selectSize(srcEle);
                });
            }

            if (first !== null) {
                addEvent(first, 'click', function(e) {
                    var e = e || window.event;
                    that.goFirst();
                });
            }
            if (last !== null) {
                addEvent(last, 'click', function(e) {
                    var e = e || window.event;
                    that.goLast();
                });
            }
            if (prev !== null) {
                addEvent(prev, 'click', function(e) {
                    var e = e || window.event;
                    that.goPrev();
                });
            }


            if (next !== null) {
                addEvent(next, 'click', function(e) {
                    var e = e || window.event;
                    that.goNext();
                });
            }

            if (jumpBtn !== null) {
                addEvent(jumpBtn, 'click', function(e) {
                    var offset = parseInt(document.querySelector('.c-Paginations-jumpfield').value);
                    if (isNaN(offset)) { return; }
                    that.jump(offset);
                });
            }

            addEvent(list, 'click', function(e) {
                var e = e || window.event;
                var srcEle = e.srcElement ? e.srcElement : e.target;
                if (srcEle.nodeName !== 'A') {
                    return;
                }
                that.goClicked(srcEle);
            });
        },
        updateList: function() {

            var items = this.makeList();
            var list = document.querySelector('.c-Paginations-list');
            list.innerHTML = items;

            var maxPageNum = Math.ceil(this.settings.totalCount / this.currentPageSize); // 在当前pageSize下计算出来的最大页码数

            var first = document.querySelector('.c-Paginations-first'),
                last = document.querySelector('.c-Paginations-last'),
                prev = document.querySelector('.c-Paginations-prev'),
                next = document.querySelector('.c-Paginations-next');

            if (this.currentPage === 1) {
                if (prev.className.indexOf(' is-disabled') === -1) {
                    prev.className += ' is-disabled';
                    first.className += ' is-disabled';
                }
                if (first.className.indexOf(' is-disabled') === -1) {
                    first.className = first.className.replace(' is-disabled', '');
                }
            } else {
                prev.className = prev.className.replace(' is-disabled', '');
                first.className = first.className.replace(' is-disabled', '');
            }

            if (this.currentPage === maxPageNum) {
                if (next.className.indexOf(' is-disabled') === -1) {
                    next.className += ' is-disabled';
                }
                if (last.className.indexOf(' is-disabled') === -1) {
                    last.className += ' is-disabled';
                }
            } else {
                next.className = next.className.replace(' is-disabled', '');
                last.className = last.className.replace(' is-disabled', '');
            }
        },
        go: function(offset, ele) {
            var that = this;

            this.currentPage = offset;
            this.updateList();

            // 调用回调
            if (typeof ele !== 'undefined') {
                this.settings.callback.call(that, this.currentPage, this.currentPageSize, ele); // 带回点击元素
            } else {
                this.settings.callback.call(that, this.currentPage, this.currentPageSize);
            }
        },
        selectSize: function(ele) {
            var that = this;

            var val = parseInt(ele.value);
            if (isNaN(val)) {
                return;
            }

            this.currentPageSize = val;

            var maxPageNum = Math.ceil(this.settings.totalCount / this.currentPageSize); // 在当前pageSize下计算出来的最大页码数

            document.querySelector('.c-Paginations-total').innerHTML = this.makeTotal();

            if (this.currentPage > maxPageNum) { // 如果构建前的currentPage大于重新计算出来的最大页码数则跳转最后一页，则重新构建list
                this.go(maxPageNum);
            }

            this.go(this.currentPage);
        },
        goFirst: function() {
            var that = this;

            if (this.currentPage === 1) {
                return;
            }

            this.go(1);
        },
        goLast: function() {
            var that = this;

            var maxPageNum = Math.ceil(this.settings.totalCount / this.currentPageSize); // 在当前pageSize下计算出来的最大页码数
            if (this.currentPage === maxPageNum) {
                return;
            }

            this.go(maxPageNum);
        },
        goPrev: function() {
            var that = this;

            var prev = this.currentPage - 1;
            if (prev < 1) {
                return;
            }

            this.go(prev);
        },
        goNext: function() {
            var that = this;

            var maxPageNum = Math.ceil(this.settings.totalCount / this.currentPageSize); // 在当前pageSize下计算出来的最大页码数

            var next = this.currentPage + 1;
            if (next > maxPageNum) {
                return;
            }

            this.go(next);
        },
        jump: function(offset) {
            var that = this;
            var maxPageNum = Math.ceil(this.settings.totalCount / this.currentPageSize); // 在当前pageSize下计算出来的最大页码数
            if (offset > maxPageNum || offset < 1 || offset === this.currentPage) {
                return;
            }

            this.go(offset);
        },
        goClicked: function(ele) {
            var index = parseInt(ele.getAttribute('data-val'));
            if (this.currentPage === index) {
                return;
            }

            this.go(index, ele); // 将点击元素传入
        }
    };
    return Pagination;
}));