// 最基础的配置文件，包含了不同环境下都可能使用到的配置

// node获取路径的模块
const path = require("path");
// node读取文件
const fs = require("fs");

// 生成html
const HTMLWebpackPlugin = require("html-webpack-plugin");
// 清理 dist 文件夹
const CleanWebpackPlugin = require("clean-webpack-plugin")
// 抽取 css
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// 引入多页面文件列表
const config = require("./config");
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];
// 入口文件集合
let Entries = {}

// 获取html文件列表
const getFileNameList = path => {
    let fileList = [];
    let dirList = fs.readdirSync(path);
    dirList.forEach(item => {
        if (item.indexOf('html') > -1) {
            fileList.push(item.split('.')[0]);
        }
    });
    return fileList;
};
let HTMLDirs = getFileNameList(config.htmlSrcPath);

// 生成HTMLWebpackPlugin实例、入口文件列表
HTMLDirs.forEach((page) => {
    const htmlPlugin = new HTMLWebpackPlugin({
        filename: `${page}.html`,
        template: path.resolve(__dirname, `../app/html/${page}.html`), // 模板文件
        chunks: [page, 'commons'], // 页面需要用到的一些js
    });
    HTMLPlugins.push(htmlPlugin);
    Entries[page] = path.resolve(__dirname, `../app/js/${page}.js`);
});

module.exports = {
    // 入口文件
    entry: Entries,
    // 启用 sourceMap
    devtool: "cheap-module-source-map",
    // 输出文件
    output: {
        filename: "js/[name].bundle.[hash].js",
        path: path.resolve(__dirname, "../dist")
    },
    // 加载器
    module: {
        rules: [{
                // 对 css 后缀名进行处理
                test: /\.css$/,
                // 不处理 node_modules 文件中的 css 文件
                exclude: /node_modules/,
                // 抽取 css 文件到单独的文件夹
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    // 设置 css 的 publicPath
                    // publicPath: config.cssPublicPath,
                    use: [{
                            loader: "css-loader",
                            options: {
                                // 开启 css 压缩
                                minimize: true,
                            }
                        },
                        {
                            loader: "postcss-loader",
                        }
                    ]
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        // 打包生成图片的名字
                        name: "[name].[ext]",
                        // 图片的生成路径
                        outputPath: config.imgOutputPath
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ["file-loader"]
            }
        ],
    },
    // 插件
    plugins: [
        // 自动清理 dist 文件夹
        new CleanWebpackPlugin(["dist"]),
        // 将 css 抽取到某个文件夹
        new ExtractTextPlugin(config.cssOutputPath),
        // 自动生成 HTML 插件
        ...HTMLPlugins
    ],
}