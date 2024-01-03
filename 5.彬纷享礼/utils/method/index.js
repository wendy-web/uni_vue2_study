import Vue from 'vue';
import {
	ttxlUserPosition,
	ttxlReportEvent
} from "./ttxlUserPosition";
import getSystemInfo from "./getSystemInfo.js";
import {
	setStorage,
	getStorage,
	storageRemove,
	storageClear,
	setExpiredStorage,
	getExpiredStorage
} from "./storage.js";
import {
	go,
	redirectTo,
	reLaunch,
	switchTab,
	navigateBack
} from "./router.js";
import {
	navigateToMiniProgram,
	openEmbeddedMiniProgram
} from "./openMiniProgram.js"
import {
	hasLogin
} from "./loginCheck.js"
/**
 * $代表全局函数
 */
//获取系统信息  参数 isRefresh 为true时会重新获取信息不读取缓存，默认为false 
Vue.prototype.$getSystemInfo = getSystemInfo
//通过指定的key找到对应配置，跳转天天享礼小程序
Vue.prototype.$ttxlUserPosition = ttxlUserPosition
Vue.prototype.$ttxlReportEvent = ttxlReportEvent
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