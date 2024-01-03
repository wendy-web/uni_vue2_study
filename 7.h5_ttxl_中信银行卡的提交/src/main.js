import Vue from 'vue';
import App from './App.vue';
import './assets/css/reset.scss';
import './assets/js/rem';

import axios from 'axios';
Vue.prototype.$axios = axios;
import Vant from 'vant'
import 'vant/lib/index.css';
Vue.use(Vant);
new Vue({
    render: h => h(App)
}).$mount('#app')
