// 使用 ESLint 代码检查时的配置文件

// 引入基础配置
const webpackBase = require("./webpack.config.base");
// 引入 webpack-merge 插件
const webpackMerge = require("webpack-merge");

const config = require("./config");

module.exports = webpackMerge(webpackBase, {
    module: {
        rules: [{
            test: /\.js$/,
            // 强制先进行 ESLint 检查
            enforce: "pre",
            // 不对 node_modules 和 lib 文件夹中的代码进行检查
            exclude: /node_modules|lib/,
            loader: "eslint-loader",
            options: {
                // 启用自动修复
                fix: true,
                // 启用警告信息
                emitWarning: true,
            }
        }, ]
    },
    devServer: {
        contentBase: config.devServerOutputPath,
        overlay: {
            errors: true,
            warnings: true
        }
    }
});