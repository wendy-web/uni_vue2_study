import pointUpgradeDia from '@/components/pointUpgradeDia.vue';
import privacy from '@/components/privacy/index.vue';
import xhNavbar from '@/components/xhNavbar/xh-navbar.vue';
import '@/utils/method/index';
import Vue from 'vue';
import App from './App';
import './static/css/common.scss'; // 样式的通用文件
import store from './store';
Vue.component('xhNavbar', xhNavbar);
// 引入新人专享的188组件
Vue.component('pointUpgradeDia', pointUpgradeDia);
Vue.component('privacy', privacy);

Vue.config.productionTip = false;
Vue.prototype.$store = store;

App.mpType = 'app'

function isPromise(obj) {
    return (!!obj &&
        (typeof obj === "object" || typeof obj === "function") &&
        typeof obj.then === "function"
    );
}
Vue.prototype.closeHandle = function() {
    console.log('close :>> 关闭新人弹窗');
}
Vue.prototype.agreePrivacyHandle = function() {
    console.log('同意授权');
}
uni.addInterceptor({
    returnValue(res) {
        if (!isPromise(res)) return res;
        return new Promise((resolve, reject) => {
            res.then((res) => {
                if (res[0]) {
                    return reject(res[0]);
                }
                resolve(res[1]);
            }).catch((e) => {});
        });
    },
});

const app = new Vue({
    ...App
})
app.$mount()
