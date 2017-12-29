// postcss配置文件

module.exports = {
    plugins: {
        'autoprefixer': {
            browsers: ['last 5 version', 'Android >= 4.0'],
            //是否美化属性值 默认：true 
            cascade: true,
            //是否去掉不必要的前缀 默认：true 
            remove: true
        }
    }
}