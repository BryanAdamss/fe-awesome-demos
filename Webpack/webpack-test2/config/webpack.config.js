const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');

const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const cssExtracter = new ExtractTextWebpackPlugin('style.css');
const sassExtracter = new ExtractTextWebpackPlugin('sass.css');

const webpack = require('webpack');

module.exports = {
    // context: path.join(__dirname, './srcasdasdasd/'),
    // entry: {
    //     app: './src/index.js'
    // },
    entry: () => { // 动态入口
        return {
            app: ['./src/index.js'],
            test: ['./src/test.js']
        };
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.join(__dirname, 'dist')
    },
    // devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, "dist"), // 这个目录下的内容可被访问
        overlay: true, // 错误信息直接显示在浏览器窗口中
        inline: true, // 实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台
        hot: true, // 配合webpack.NamedModulesPlugin、webpack.HotModuleReplacementPlugin完成MHR
        // publicPath: '/assets/', // 静态资源存放位置，根目录的assets文件夹，确保publicPath总是以斜杠(/)开头和结尾。可以设置为CDN地址。这个选项类似url-prefix
        host: "0.0.0.0", // 设置为0.0.0.0并配合useLocalIp可以局域网访问
        useLocalIp: true, // 使用本机IP打开devServer，而不是localhost
        // proxy: {// 可以通过proxy代理其他服务器的api
        //     "/api": "http://localhost:3000"
        // }
    },
    module: {
        rules: [{
            test: /\.css$/,
            // use: cssExtracter.extract({
            //     fallback: 'style-loader',
            //     use: ['css-loader', 'postcss-loader']
            // })
            include: [
                path.resolve(__dirname, "./src/")
            ],
            use: ['style-loader', 'css-loader', 'postcss-loader']
        }, {
            test: /\.scss$/,
            include: [
                path.resolve(__dirname, "./src/")
            ],
            // use: sassExtracter.extract({
            //     fallback: 'style-loader',
            //     use: ['css-loader', 'postcss-loader', 'sass-loader']
            // })
            use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        }, {
            test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
            include: [
                path.resolve(__dirname, "./src/")
            ],
            use: 'file-loader'
        }, {
            test: /\.(png|jpg|gif)$/,
            include: [
                path.resolve(__dirname, "./src/")
            ],
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    fallback: 'file-loader'
                }
            }]
        }, {
            test: /\.js$/,
            include: [
                path.resolve(__dirname, "./src/")
            ],
            use: ['babel-loader']
        }]
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './src/html/index.html',
            chunks: ['app', 'common']
        }),
        new HTMLWebpackPlugin({
            filename: 'test.html',
            chunks: ['test', 'common']
        }),
        cssExtracter,
        sassExtracter,
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({ // 抽取公共chunk
            name: 'vendor' // 指定公共 bundle 的名称。
        })
        // new webpack.DefinePlugin({ // 指定为生产环境，全局环境下就可以访问到process.env.NODE_ENV
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify('production')
        //     }
        // })
    ]
};