import Vue from 'vue';
import App from './App';
import store from './store';
import '@/utils/method/index';
// import Mock from './mock'; // mock数据的重定向使用
import {
    router
} from '@/utils/router';
/* 引入公共js*/
import common from '@/static/js/common.js';
import xhNavbar from '@/components/xhNavbar/xh-navbar.vue';
import LightingMode from '@/components/LightingMode.vue';
import privacy from '@/components/privacy/index.vue';

Vue.component('xhNavbar', xhNavbar);
Vue.component('LightingMode', LightingMode);
Vue.component('privacy', privacy);

Vue.config.productionTip = false;

App.mpType = 'app';

Vue.prototype.$store = store;
Vue.prototype.$router = router;
Vue.prototype.common = common;

const app = new Vue({
    ...App
});
app.$mount();