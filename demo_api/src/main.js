import Vue from 'vue';
import App from './App';
import './uni.promisify.adaptor';
import '@/utils/method/index'; // 引用通用的使用方法


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
