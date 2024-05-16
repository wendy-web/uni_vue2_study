import Vue from 'vue';
import {
    go,
    back,
    leftBack,
    redirectTo,
    reLaunch,
    switchTab
} from "./navigation";

import {
    showToast,
    hideToast,
    showLoading,
    hideLoading,
    showNavigationBarLoading,
    hideNavigationBarLoading,
    showModal,
} from "./toast";

import {
    storageRead,
    storageSave,
    storageRemove,
    storageClear,
    setNavigationBarTitle,
    stopPullDownRefresh,
    makePhoneCall,
    jsonToUrl,
} from "./util";

import {
    wxReportEvent,
    openEmbeddedMiniProgram,
    navigateToMiniProgram,
    top_callBack,
    subscribeMessageHandle
} from './method.js'

// import dayjs from "dayjs";
// // 时间操作
// Vue.prototype.$day = dayjs;

// 路由跳转
Vue.prototype.$go = go;
Vue.prototype.$back = back;
Vue.prototype.$leftBack = leftBack;
Vue.prototype.$redirectTo = redirectTo;
Vue.prototype.$reLaunch = reLaunch;
Vue.prototype.$switchTab = switchTab;

// 提示
Vue.prototype.$toast = showToast;
Vue.prototype.$hideToast = hideToast;
Vue.prototype.$showLoading = showLoading;
Vue.prototype.$hideLoading = hideLoading;
Vue.prototype.$showNavigationBarLoading = showNavigationBarLoading;
Vue.prototype.$hideNavigationBarLoading = hideNavigationBarLoading;
Vue.prototype.$showModal = showModal;

// 本地缓存
Vue.prototype.$storageRead = storageRead;
Vue.prototype.$storageSave = storageSave;
Vue.prototype.$storageRemove = storageRemove;
Vue.prototype.$storageClear = storageClear;

// 设置title
Vue.prototype.$setNavigationBarTitle = setNavigationBarTitle;

// 停止刷新
Vue.prototype.$stopPullDownRefresh = stopPullDownRefresh;

// 拨打电话
Vue.prototype.$makePhoneCall = makePhoneCall;

// 页面事件
Vue.prototype.$wxReportEvent = wxReportEvent;
Vue.prototype.$topCallBack = top_callBack;
Vue.prototype.$subscribeMessageHandle = subscribeMessageHandle;

Vue.prototype.$openEmbeddedMiniProgram = openEmbeddedMiniProgram;
Vue.prototype.$navigateToMiniProgram = navigateToMiniProgram;
