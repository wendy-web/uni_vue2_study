import '@/static/css/common.scss';
import '@/utils/method/index';
import '@/utils/mixin/index';
import { router } from '@/utils/router';
import Vue from 'vue';
import App from './App';
import store from './store';
// import Mock from './mock'; // mock数据的重定向使用

import xhNavbar from '@/components/xhNavbar/xh-navbar.vue';
Vue.component('xhNavbar', xhNavbar);

// 用户隐私权限的嵌入
import privacyOpen from '@/components/privacy/indexOpen.vue';
Vue.component('privacyOpen', privacyOpen);

// 推券列表
import recommendDia from '@/components/recommendDia/index.vue';
Vue.component('recommendDia', recommendDia);

Vue.config.productionTip = false;
App.mpType = 'app';

Vue.prototype.$store = store;
Vue.prototype.$router = router;
Vue.prototype.getHandle = function() {}

const app = new Vue({
    ...App
});
app.$mount();
