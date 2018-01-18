var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function() {
    console.log('服务启动在:%d', port);
});

app.use(express.static(path.join(__dirname, './public')));


var onlineUsers = {}; //在线用户

var onlineCount = 0; //当前在线人数

// 监听用户连接
io.on('connection', function(socket) {
    console.log('有用户连接!');
    // 连接后监听相应事件

    // 监听客户端的登录事件
    socket.on('login', function(obj) {

        // 保存连接的id，退出时会用到
        socket.id = obj.userId;

        // 将新的连接加入到在线列表中
        if (!onlineUsers.hasOwnProperty(obj.userId)) {
            onlineUsers[obj.userId] = obj.userName;
            onlineCount++;
        }

        // 向所有客户端广播有新用户加入，并将新用户及最新的在线人数和在线列表传过去
        io.emit('newIn', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj });

        console.log(obj.userName + '加入了聊天室');
    });

    // 监听客户端的发送事件，将其广播给所有用户
    socket.on('message', function(obj) {
        console.log('%s说了:%s', obj.name, obj.message);
        io.emit('message', obj);
    });

    // 监听客户端的离线事件
    socket.on('disconnect', function() {
        // 在线列表中删除对应的连接
        if (onlineUsers.hasOwnProperty(socket.id)) {
            var obj = { userId: socket.id, userName: onlineUsers[socket.id] };

            delete onlineUsers[socket.id];

            onlineCount--;
            // 向所有客户端广播有用户退出    
            io.emit('logout', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj });
            console.log(obj.userName + '退出了聊天室');
            console.log('现在聊天室里有:', onlineUsers);
        }
    });
});