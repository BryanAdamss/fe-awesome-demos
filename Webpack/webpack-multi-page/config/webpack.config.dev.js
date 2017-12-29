// 开发环境配置文件

// 引入基础配置文件
const webpackBase = require("./webpack.config.base");
// 引入 webpack-merge 插件
const webpackMerge = require("webpack-merge");
// 引入配置文件
const config = require("./config");
// 合并配置文件
module.exports = webpackMerge(webpackBase, {
    // 配置 webpack-dev-server
    devServer: {
        // 项目根目录
        contentBase: config.devServerOutputPath,
        // 错误、警告展示设置
        overlay: {
            errors: true,
            warnings: true
        }
    }
});