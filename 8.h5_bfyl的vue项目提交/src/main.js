import Vue from 'vue'
import App from './App.vue'
import store from './store'

import 'amfe-flexible';
// 引入重置样式表
import '@/assets/css/reset.css'
// 在 入口文件mian.js 引入路由文件
import router from '@/router/index.js';
//导入所有组件
import Vant from 'vant';
import 'vant/lib/index.css';
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import animated from 'animate.css'
// 引入lottie组件
import lottie from 'vue-lottie'
Vue.component('lottie', lottie)

Vue.use(VueAwesomeSwiper)
Vue.use(Vant)
// 使用animate.css
Vue.use(animated)

Vue.config.productionTip = false
Vue.prototype.$store = store;
new Vue({
  router,  // router 挂载到根实例对象上
  render: h => h(App)
}).$mount('#app')
