import store from '@/store';

const _defaultConfig = {
    appid: 'wx6deb62d876c03d85',
    path: '/pages/tabBar/shopMall/index'
}

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
    ntry: 'ntry', // 试试手气
    code_newuser: 'npicture',
    code_ntry: 'ntry'
}

export function ttxlReportEvent(key) {
    console.log('埋点', _ttxlEventConfig[key] || key)
    wx.reportEvent(_ttxlEventConfig[key] || key)
}

export function ttxlUserPosition(key) {
    return new Promise((resolve, reject) => {
        let { appid: appId, path } = store.getters.ttxlJumpConfig[key] || _defaultConfig;
        // 没有path则不执行 并返回true
        if (!path) return true;
        wx.navigateToMiniProgram({
            appId,
            path,
            envVersion: 'trial',
            success(res) {},
            fail(error) {},
            complete: function(res) {
                const regex = /\bcancel\b/i;
                if (regex.test(res.errMsg)) return resolve(0); // 取消跳转
                resolve(1);
            }
        })
        ttxlReportEvent(key);
    }).catch((e) => {});
}
