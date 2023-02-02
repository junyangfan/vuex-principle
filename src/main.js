import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from 'vue-router'

Vue.config.productionTip = false

new Vue({
  name:'main',
  router, //封装了 router-view router-link $router $route
  store,  //写到这里，说明全部的组件都可以使用store
  render: h => h(App)
}).$mount('#app')
