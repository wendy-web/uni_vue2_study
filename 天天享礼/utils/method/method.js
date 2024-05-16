import { getAutoLogin } from '../auth.js';
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

export function top_callBack() {
    uni.navigateBack({
        fail() {
            uni.switchTab({
                url: '/pages/tabBar/shopMall/index'
            });
        }
    });
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
