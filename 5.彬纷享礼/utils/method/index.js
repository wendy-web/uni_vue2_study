import Vue from 'vue';
import getSystemInfo from "./getSystemInfo.js";
import {
    hasLogin
} from "./loginCheck.js";
import {
    navigateToMiniProgram,
    openEmbeddedMiniProgram
} from "./openMiniProgram.js";
import {
    go,
    navigateBack,
    reLaunch,
    redirectTo,
    switchTab
} from "./router.js";
import {
    getExpiredStorage,
    getStorage,
    setExpiredStorage,
    setStorage,
    storageClear,
    storageRemove
} from "./storage.js";
import {
    ttxlReportEvent,
    ttxlReportEventRequest,
    ttxlUserPosition,
    ttxlUserPositionAsync
} from "./ttxlUserPosition";
/**
 * $代表全局函数
 */
//获取系统信息  参数 isRefresh 为true时会重新获取信息不读取缓存，默认为false 
Vue.prototype.$getSystemInfo = getSystemInfo
    //通过指定的key找到对应配置，跳转天天享礼小程序
Vue.prototype.$ttxlUserPosition = ttxlUserPosition
Vue.prototype.$ttxlUserPositionAsync = ttxlUserPositionAsync
Vue.prototype.$ttxlReportEvent = ttxlReportEvent
Vue.prototype.$ttxlReportEventRequest = ttxlReportEventRequest
    //本地缓存
Vue.prototype.$setStorage = setStorage
Vue.prototype.$getStorage = getStorage
Vue.prototype.$storageRemove = storageRemove
Vue.prototype.$storageClear = storageClear
Vue.prototype.$setExpiredStorage = setExpiredStorage
Vue.prototype.$getExpiredStorage = getExpiredStorage
    //跳转
Vue.prototype.$go = go
Vue.prototype.$redirectTo = redirectTo
Vue.prototype.$reLaunch = reLaunch
Vue.prototype.$switchTab = switchTab
Vue.prototype.$navigateBack = navigateBack
    //跳转小程序
Vue.prototype.$navigateToMiniProgram = navigateToMiniProgram
Vue.prototype.$openEmbeddedMiniProgram = openEmbeddedMiniProgram
    //校验并处理登录授权问题
Vue.prototype.$hasLogin = hasLogin