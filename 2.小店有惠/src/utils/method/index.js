import Vue from 'vue';
import {
    go,
    leftBack,
    reLaunch,
    redirectTo,
    switchTab
} from "./navigation";
import {
    hideLoading,
    hideNavigationBarLoading,
    hideToast,
    showLoading,
    showModal,
    showNavigationBarLoading,
    showToast,
} from "./toast";

import {
    makePhoneCall,
    setNavigationBarTitle,
    stopPullDownRefresh,
    storageClear,
    storageRead,
    storageRemove,
    storageSave,
} from "./util";

import {
    agreementLookHandle,
    downloadFile,
    getWritePhotosAlbum,
    navigateToMiniProgram,
    openEmbeddedMiniProgram,
    saveImageToPhotosAlbum,
    setWritePhotosAlbum,
    subscribeMessageHandle,
    wxReportEvent
} from './method.js';

// 路由跳转
Vue.prototype.$go = go;
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
Vue.prototype.$openEmbeddedMiniProgram = openEmbeddedMiniProgram;
Vue.prototype.$navigateToMiniProgram = navigateToMiniProgram;
Vue.prototype.$agreementLookHandle = agreementLookHandle;
Vue.prototype.$subscribeMessageHandle = subscribeMessageHandle;
Vue.prototype.$saveImageToPhotosAlbum = saveImageToPhotosAlbum;
Vue.prototype.$getWritePhotosAlbum = getWritePhotosAlbum;
Vue.prototype.$setWritePhotosAlbum = setWritePhotosAlbum;
Vue.prototype.$downloadFile = downloadFile;
