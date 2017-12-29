const express = require('express'); // express服务器
const webpack = require('webpack'); // 使用webpack加载配置
const webpackDevMiddleware = require('webpack-dev-middleware'); // 中间件

const app = express();
const config = require('./webpack.config.js');

const compiler = webpack(config);

// 告诉express使用webpack-dev-middleware和webpack.config.js
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}));

// 服务启动在3000端口
app.listen(3000, function() {
    console.log('Example app listening on port 3000!\n');
});