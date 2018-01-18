(function() {
    function addEvent(ele, type, handler) {
        if (ele.addEventListener) {
            ele.addEventListener(type, handler, false);
        } else if (ele.attachEvent) {
            ele.attachEvent("on" + type, handler);
        } else {
            ele["on" + type] = handler;
        }
    }

    function trim(str) {
        if (!str.trim) {
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
        return str.trim();
    }

    window.onload = function() {
        main();
    };

    function main() {
        var loginInput = document.querySelector('#js_loginInput'),
            loginBox = document.querySelector('#js_loginBox');

        loginInput.focus(); // 登录框默认聚焦

        var URL = 'http://192.168.23.27:3000';
        addEvent(loginInput, 'keydown', function(e) {
            var e = e || window.e;
            if (e.keyCode === 13) {
                var val = trim(loginInput.value);
                if (val !== '') {
                    // 隐藏登录框
                    loginInput.value = '';
                    loginBox.className = loginBox.className + ' is-hide';

                    // 创建一个ws连接
                    var link = new Link(URL, val);
                }
            }
        });
    }


    function Link(url, name) {
        this.url = url;
        this.userName = trim(name);
        this.init();
    }

    Link.prototype = {
        constructor: Link,
        init: function() {
            var self = this;

            this.socket = io.connect(this.url);
            this.userId = this.genUid();
            this.submitInput = document.querySelector('#js_chatInput');
            this.list = document.querySelector('#js_chatList');
            this.hd = document.querySelector('#js_chatHd');

            this.submitInput.focus();

            this.socket.emit('login', { userName: this.userName, userId: this.userId }); // 告诉服务端，当前客户端登录了

            this.socket.on('newIn', function(o) { // 监听服务端派发的用户登录事件
                var li = self.makeTips(o.user.userName);

                self.updateList(li);
                self.updateOnline(o.onlineUsers, o.onlineCount);
            });

            addEvent(this.submitInput, 'keydown', function(e) {
                var e = e || window.e;
                var text = trim(self.submitInput.value);
                if (e.keyCode === 13) {
                    if (text !== '') {
                        self.submitInput.value = '';

                        self.socket.emit('message', { message: text, name: self.userName, id: self.userId }); // 告诉服务端，当前客户端发送了一个message
                    }
                }
            });

            this.socket.on('message', function(o) { // 监听服务端派发的message事件
                var isMe = o.id === self.userId ? true : false; // 判断消息是否是当前客户端发送的

                var li = self.makeMessage(o.name, o.message, isMe);
                self.updateList(li);
            });

            this.socket.on('logout', function(o) { // 监听服务端派发的logout事件
                var li = self.makeTips(o.user.userName, true);

                self.updateList(li);
                self.updateOnline(o.onlineUsers, o.onlineCount);
            });
        },
        genUid: function() {
            return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100); // 生成唯一id，用于后面的判断
        },
        makeTips: function(name, logout) {
            if (typeof name === 'undefined') {
                return;
            }

            var li = document.createElement('li');
            li.className = 'c-ChatList-item is-tips';
            if (logout) {
                li.innerHTML = '<span class="c-ChatList-tip">' + name + '退出了聊天室</span>';
            } else {
                li.innerHTML = '<span class="c-ChatList-tip">' + name + '加入了聊天室</span>';
            }

            return li;
        },
        makeMessage: function(name, text, me) {
            if (typeof name === 'undefined' || typeof text === 'undefined') {
                return;
            }

            var li = document.createElement('li');
            if (me) {
                li.className = 'c-ChatList-item fadeInRight is-me';
                li.innerHTML = '<div class="c-ChatList-cont"><div class="c-ChatList-text">' + text + '</div><div class="c-ChatList-name">' + name + '</div></div>';
            } else {
                li.className = 'c-ChatList-item fadeInLeft';
                li.innerHTML = '<div class="c-ChatList-cont"><div class="c-ChatList-name">' + name + '</div><div class="c-ChatList-text">' + text + '</div></div>';
            }

            return li;
        },
        updateList: function(li) {
            this.list.appendChild(li);

            li.scrollIntoView();
        },
        updateOnline: function(users, count) {
            var html = '在线人数：' + count + '人；在线列表：';
            var arr = [];

            for (var key in users) {
                if (users.hasOwnProperty(key)) {
                    arr.push(users[key]);
                }
            }

            html += arr.join('、');

            this.hd.innerHTML = html;
        }
    };
})();