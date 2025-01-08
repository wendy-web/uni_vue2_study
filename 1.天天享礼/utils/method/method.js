import store from '@/store';
import { getAutoLogin } from '../auth.js';
import { go as $go } from './navigation';
const authorization = Number(Boolean(getAutoLogin()));
const platform = wx.getSystemInfoSync().platform;
let devices = '';
if (platform == 'android') {
    devices = 0;
} else if (platform == 'ios') {
    devices = 1;
}
// 授权属性：authorization，0 代表未授权，1 代表已授权
// 设备属性：devices，0 代表Android，1 代表iOS
// 来源属性：source，0 代表优惠券详情进入，1 代表专属优惠券进入
export function wxReportEvent(eventId, paramsData) {
    let source = '';
    if (paramsData) {
        source = paramsData.source;
    }
    if (!eventId) return;
    wx.reportEvent(eventId, {
        authorization,
        devices,
        source
    });
}
// 全屏打开
export function navigateToMiniProgram(data) {
    let openMiniProgram = uni.navigateToMiniProgram;
    openMiniProgram(data);
}

// 打开半屏
export function openEmbeddedMiniProgram(data) {
    let openMiniProgram = wx.navigateToMiniProgram;
    if (wx.canIUse('openEmbeddedMiniProgram')) {
        openMiniProgram = wx.openEmbeddedMiniProgram;
    }
    openMiniProgram(data);
}

// 消息订阅
export function subscribeMessageHandle(tmplIds = []) {
    return new Promise((resolve, reject) => {
        uni.requestSubscribeMessage({
            tmplIds,
            complete: (event) => resolve(event),
        });

    })
}
// 跳入到小店有惠进行点单的测验
export function goToDiscountsMini(path = '/pages/tabBar/discounts/index', envVersion = 'trial') {
    let pathUrl = path || '/pages/tabBar/discounts/index';
    const userInfo = store.getters.userInfo;
    if (userInfo) pathUrl += `?tt_uid=${userInfo.id}`;
    openEmbeddedMiniProgram({
        appId: 'wx4c6b177c1b506b06',
        path: pathUrl,
        envVersion,
    })
}
// 聚推客 - 电影
export function goToMoviePlugin() {
    let url = 'plugin-private://wx89752980e795bfde/pages/index/index?pub_id=27729&sid=ttxl';
    const userInfo = store.getters.userInfo;
    if (userInfo) url += `${userInfo.id}`;
    $go.call(this, url);
}
// 聚推客 - 打车出行
export function goToCarPlugin() {
    let url = 'plugin://meishi/shop?type=didi&pub_id=27729&sid=ttxl';
    const userInfo = store.getters.userInfo;
    if (userInfo) url += `${userInfo.id}`;
    $go.call(this, url);
}
