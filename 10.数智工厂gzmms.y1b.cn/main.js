import Vue from 'vue';
import App from './App';
import store from './store';

import {
	imgBaseUrl
} from "@/api/http/xhHttp.js"

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$store = store;

Vue.prototype.$imgBaseUrl = imgBaseUrl;


import uvUI from '@/uni_modules/uv-ui-tools'

Vue.use(uvUI);
const app = new Vue({
	...App
});
app.$mount();