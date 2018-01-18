'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction ?
  config.build.productionSourceMap :
  config.dev.cssSourceMap

module.exports = {
  // 处理.vue文件中的样式
  loaders: utils.cssLoaders({
    // 是否打开source-map
    sourceMap: sourceMapEnabled,
    // 是否提取样式到单独的文件
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
