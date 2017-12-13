import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

// Vue.config.productionTip = false
import 'common/stylus/index.styl'

fastclick.attach(document.body)

Vue.use(VueLazyLoad,{
  loading:require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
