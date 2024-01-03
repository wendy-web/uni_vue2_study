import Vue from 'vue';
import App from './App';
import store from './store';
import './static/css/common.scss'; // 样式的通用文件
import '@/utils/method/index';
import xhNavbar from '@/components/xhNavbar/xh-navbar.vue';
import pointUpgradeDia from '@/components/pointUpgradeDia.vue';
import privacy from '@/components/privacy/index.vue';
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
uni.addInterceptor({
    returnValue(res) {
        if (!isPromise(res)) {
            return res;
        }
        return new Promise((resolve, reject) => {
            res.then((res) => {
                if (res[0]) {
                    reject(res[0]);
                } else {
                    resolve(res[1]);
                }
            });
        });
    },
});

const app = new Vue({
    ...App
})
app.$mount()