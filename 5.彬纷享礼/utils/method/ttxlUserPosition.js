import { groupGoods } from "@/api/modules/ttxl.js";
import store from '@/store';
const _defaultConfig = {
    appid: 'wx6deb62d876c03d85',
    path: '/pages/tabBar/shopMall/index'
}

const _envVersion = "trial"

const _ttxlEventConfig = {
    //匹配值
    home_benefits: 'swelfare',
    code_losing: 'lexchange',
    code_popover_close: 'lexchange',
    shop_use: 'gouse',
    shop_draw: 'lottery',
    my_score: 'uintegral',
    my_shop: 'integral',
    my_benefits: 'obenefits',
    my_order: 'order',
    my_exchange: 'mexchange',
    code_abnormal: 'cpicture',
    code_popover_button: 'gexchange',
    code_exchange: 'nmexchange',
    //本身值 需要手动调用 ttxlReportEvent
    lwvideo: 'lwvideo',
    code_newuser: 'npicture'
}

export function ttxlReportEvent(key) {
    console.log('埋点:', _ttxlEventConfig[key] || key);
    wx.reportEvent(_ttxlEventConfig[key] || key);
}

export function ttxlUserPosition(key) {
    let {
        appid: appId,
        path
    } = store.getters.ttxlJumpConfig[key] || _defaultConfig;
    console.log('跳转的path：', path)
        // 没有path则不执行 并返回true
    if (!path) return true;
    wx.navigateToMiniProgram({
        appId,
        path,
        envVersion: _envVersion
    })
    ttxlReportEvent(key);
}

export function ttxlUserPositionAsync(key, isReport = true) {
    return new Promise((resolve, reject) => {
        let {
            appid: appId,
            path
        } = store.getters.ttxlJumpConfig[key] || _defaultConfig;
        wx.navigateToMiniProgram({
            appId,
            path,
            envVersion: _envVersion,
            complete: function(res) {
                const regex = /\bcancel\b/i;
                if (regex.test(res.errMsg)) return resolve(0); // 取消跳转
                resolve(1);
            }
        })
        isReport && ttxlReportEvent(key);
    })
}

// 记录当前页面的访问 groupId：当前访问页面的路径router
export function ttxlReportEventRequest(path) {
    if (!path) return;
    groupGoods({
        path_type: -1,
        groupId: path
    })
}