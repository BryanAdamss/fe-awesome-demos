const path = require('path'); // nodejs获取路径
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html模板
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理指定文件夹
const webpack = require('webpack'); // 使用webpack自带插件


module.exports = {
    entry: { // 入口
        // app: './src/index.js',
        // print: './src/print.js',

        main: './src/index.js',
        vendor: ['lodash']
    },
    output: { // 出口
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'), //__dirname是nodejs中的全局变量用于获取当前文件的完整绝对路径
        publicPath: '/', // 资源发布到服务时的路径，有些文件会放到cdn上，通过配置publicPath可以获取正确路径
    },
    devServer: { // 使用webpack-dev-server
        contentBase: './dist', // 将dist文件夹下的文件作为可访问文件
        hot: true, // 启用MHR
    },
    module: {
        rules: [{ // 针对收集到的.css结尾的依赖，先使用css-loader，再使用style-loader
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            { // 针对图片，使用file-loader导入
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '我来自HtmlWebpackPlugin'
        }),
        new CleanWebpackPlugin(['dist']),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime' // 指定公共 bundle 的名称。
        })
    ],
};