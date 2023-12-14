import Vue from 'vue';
import {
    go,
    back,
    redirectTo,
    reLaunch,
    switchTab,
    openEmbeddedMiniProgram,
    navigateToMiniProgram,
    hideHomeButton
} from "./navigation.js";


/**
 * 路由跳转
 * this.$go(pathUrl: string);
 * 传入path的url('/page/home/index')的地址；
 */
Vue.prototype.$go = go; // 保留当前页，跳转到指定页
Vue.prototype.$back = back; // 返回上一页/无上一页即跳转首页
Vue.prototype.$redirectTo = redirectTo; // 关闭当前页(卸载)，跳转到指定页
Vue.prototype.$reLaunch = reLaunch; // 关闭卸载所有页面，可以打开任意页面
Vue.prototype.$switchTab = switchTab; // 只能用于跳转到tabbar页面，并关闭其他非tabbar页面,tabbar之间做切换

/**
 * 跳转小程序
 * this.$openEmbeddedMiniProgram(data:object);
 * data: {
 *  appId: 'wx6deb62d876c03d85',
 *  envVersion:'trial',
 *  path: '/pages/tabBar/shopMall/index',
 *  success: () => {},
 *  fail: () => {},
 *  complete: () => {}
 * }
 * envVersion: 跳转环境
 * develop	开发版
 * trial	体验版
 * release	正式版
 *
 * 兼容性配置：
 * 微信小程序2.23.1以下版本基础库，开发者需要在全局配置manifest.json-->mp-weixin节点下添加embeddedAppIdList字段并声明需要半屏跳转的小程序，
 * 若不配置将切换为普通的小程序跳转小程序。2.23.1及以上版本起无需配置。
 * "mp-weixin" : {
 *   "embeddedAppIdList": ["wx6deb62d876c03d85"] //需要半屏跳转的小程序appid
 * }
 */
Vue.prototype.$openEmbeddedMiniProgram = openEmbeddedMiniProgram; // 半屏跳转小程序
Vue.prototype.$navigateToMiniProgram = navigateToMiniProgram; // 全屏跳转小程序

import {
    showToast,
    hideToast,
    showLoading,
    hideLoading,
    showNavigationBarLoading,
    hideNavigationBarLoading,
    showModal,
} from "./toast.js";
/**
 * 提示弹窗
 * this.$toast(title: string); toast的使用
 * this.$hideToast(); 隐藏toast
 * this.$showLoading(title: string); 展示loading的呈现
 * this.$hideLoading(); 展示loading的呈现
 * this.$showNavigationBarLoading(); 在当前页面显示导航条加载动画
 * this.$hideNavigationBarLoading(); 在当前页面隐藏导航条加载动画
 * this.$showModal() 显示模态弹窗，可以只有一个确定按钮，也可以同时有确定和取消按钮
 * this.$hideHomeButton() 隐藏返回首页按钮
 */
Vue.prototype.$toast = showToast;
Vue.prototype.$hideToast = hideToast;
Vue.prototype.$showLoading = showLoading;
Vue.prototype.$hideLoading = hideLoading;
Vue.prototype.$showNavigationBarLoading = showNavigationBarLoading;
Vue.prototype.$hideNavigationBarLoading = hideNavigationBarLoading;
Vue.prototype.$showModal = showModal;
Vue.prototype.$hideHomeButton = hideHomeButton;
import {
    storageRead,
    storageSave,
    storageRemove,
    storageClear,
    setNavigationBarTitle,
    stopPullDownRefresh,
    makePhoneCall,
} from "./util.js";

/**
 * this.$storageRead(key: string); 读取本地缓存的数据
 * this.$storageSave(key: string, value: string); 存储缓存的数据
 * this.$storageRemove(key: string); 移除缓存的数据
 * this.$storageClear(); 清除存储的数据
 * this.$storageClear(); 清除存储的数据
 * this.$setNavigationBarTitle(title: string); 设置表头的title的文本
 * this.$stopPullDownRefresh(); 停止页面的刷新
 * this.$makePhoneCall(phone: string) 拨打电话
 */
Vue.prototype.$storageRead = storageRead;
Vue.prototype.$storageSave = storageSave;
Vue.prototype.$storageRemove = storageRemove;
Vue.prototype.$storageClear = storageClear;
Vue.prototype.$setNavigationBarTitle = setNavigationBarTitle;
Vue.prototype.$stopPullDownRefresh = stopPullDownRefresh;
Vue.prototype.$makePhoneCall = makePhoneCall;


import { wxReportEvent } from './method.js';
/**
 * 页面事件
 * this.$wxReportEvent(eventId: string); 埋点事件的添加
 */
Vue.prototype.$wxReportEvent = wxReportEvent; // 埋点
