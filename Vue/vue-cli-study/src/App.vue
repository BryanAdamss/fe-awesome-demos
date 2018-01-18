<!-- 每个.vue文件只能包含一个template -->
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<!-- 每个 .vue 文件最多包含一个 <script> 块 -->
<script>
export default {
  name: 'app'
}
</script>

<!-- 可以有多个style，可以在根组件中导入一些全局样式 -->
<style src="./assets/test.scss" lang="scss"></style>
<style src="./assets/test2.scss" lang="scss"></style>
<!-- 导入路径都是基于当前目录的，不过可以从NPM包中直接导入资源，如下 -->
<!-- <style src="todomvc-app-css/index.css"></style> -->
<!-- 当style标签有 scoped 属性时，它的 CSS 只作用于当前组件中的元素 -->
<!-- <style scoped>.example {color: red;}</style> -->
<!-- 在你的 <style> 上添加 module 属性，将为 css-loader 打开 CSS Modules 模式，生成的 CSS 对象将为组件注入一个名叫 $style 的计算属性，你可以在你的模块中使用动态 class 绑定 -->