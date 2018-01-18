'use strict'
// Template version: 1.2.8
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},

    // Various Dev Server settings
    // host: 'localhost', // can be overwritten by process.env.HOST
    host: '0.0.0.0', // 配合使用useLocalIp，可以让局域网内可访问
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true, // 启动后是否自动打开浏览器
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true, // 配置eslint
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: true, // 将eslint的错误信息显示在浏览器上

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true,
  },
  // 构建产品时使用的配置
  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'), // 产品文件的存放路径
    assetsSubDirectory: 'static', // 二级目录，存放静态资源文件的目录，位于dist文件夹下
    assetsPublicPath: '/', // 发布路径，如果构建后的产品文件有用于发布CDN或者放到其他域名的服务器，可以在这里进行设置，设置之后构建的产品文件在注入到index.html中的时候就会带上这里的发布路径

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false, // 是否开启gzip压缩
    productionGzipExtensions: ['js', 'css'], // gzip模式下需要压缩的文件的扩展名，设置js、css之后就只会对js和css文件进行压缩

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    // 是否展示webpack构建打包之后的分析报告
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
