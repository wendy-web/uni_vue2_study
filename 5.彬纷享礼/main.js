import Vue from 'vue';
import App from './App';
import store from './store';

import '@/utils/method/index.js'

import easyLoadimage from '@/components/easy-loadimage.vue';
import xhBannerAds from '@/components/xh-banner-ads.vue';
import xhCheck from '@/components/xh-check.vue';
import xhMsgDialog from '@/components/xh-msg-dialog.vue';
import xhNotify from '@/components/xh-notify.vue';
import xhScanCode from '@/components/xh-scan-code.vue';
import repayments from '@/components/repayments.vue';
import userGuide from '@/components/userGuide.vue';
import xhNavbar from '@/components/xhNavbar/xh-navbar.vue';
import xhSteps from '@/components/xh-steps.vue';
import welfarePpopup from '@/components/welfarePpopup.vue';
import privacyPopup from '@/components/privacyPopup.vue';
import protocolConfirm from '@/components/protocolConfirm.vue';

Vue.component('easy-loadimage', easyLoadimage);
Vue.component('xh-banner-ads', xhBannerAds);
Vue.component('xh-check', xhCheck);
Vue.component('xh-msg-dialog', xhMsgDialog);
Vue.component('xh-notify', xhNotify);
Vue.component('xh-scan-code', xhScanCode);
Vue.component('userGuide', userGuide);
Vue.component('repayments', repayments);
Vue.component('xhNavbar', xhNavbar);
Vue.component('xh-steps', xhSteps);
Vue.component('privacyPopup', privacyPopup);
Vue.component('welfarePpopup', welfarePpopup);
Vue.component('protocolConfirm', protocolConfirm);
Vue.config.productionTip = false;

App.mpType = 'app';

Vue.prototype.$store = store;
// Vue.prototype.$router = router;

const app = new Vue({
	...App
});
app.$mount();