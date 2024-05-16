import API from '../xhHttp.js';
//每日打卡
export function punch(data) {
    return API.request({
        url: '/api/profile/punch',
        method: 'post',
        data
    });
}

//能否打卡
export function canPunch(data) {
    return API.request({
        url: '/api/profile/canPunch',
        method: 'post',
        data
    });
}

//我的收藏
export function couponCollect(data) {
    return API.request({
        url: '/api/profile/couponCollect',
        method: 'post',
        data
    });
}

// 浏览记录
export function watchLog(data) {
    return API.request({
        url: '/api/profile/watchLog',
        method: 'post',
        data
    });
}
// 删除浏览记录
export function watchDel(data) {
    return API.request({
        url: '/api/profile/watchDel',
        method: 'post',
        data
    });
}

//收藏优惠券
export function toggleCollect(data) {
    return API.request({
        url: '/api/profile/toggleCollect',
        method: 'post',
        data,
        isNoLoading: true
    });
}
//牛金豆记录
export function creditsLog(data) {
    return API.request({
        url: '/api/profile/creditsLog',
        method: 'post',
        data
    });
}
//常见问题
export function question(data) {
    return API.request({
        url: '/api/profile/question',
        method: 'post',
        data
    });
}
//我的优惠券
export function myCoupon(data) {
    return API.request({
        url: '/api/profile/myCoupon',
        method: 'post',
        data
    });
}
// 用户首页统计
export function profile(data) {
    return API.request({
        url: '/api/profile',
        method: 'post',
        data
    });
}
// 使用优惠券
export function applyCoupon(data) {
    return API.request({
        url: '/api/shop/applyCoupon',
        method: 'post',
        data
    });
}
// 立即购买
export function buy(data) {
    return API.request({
        url: '/api/shop/buy',
        method: 'post',
        data
    });
}
// 账户余额查询
export function profit(data) {
    return API.request({
        url: '/api/profit/info',
        method: 'post',
        data
    });
}
// 返利领取
export function profitGet(data) {
    return API.request({
        url: '/api/profit/profitGet',
        method: 'post',
        data
    });
}
// 返现记录
export function profitList(data) {
    return API.request({
        url: '/api/profit/profitList',
        method: 'post',
        data
    });
}
// 申请提现
export function withdraw(data) {
    return API.request({
        url: '/api/profit/withdraw',
        method: 'post',
        data
    });
}
// 提现记录
export function withdrawLog(data) {
    return API.request({
        url: '/api/profit/withdrawLog',
        method: 'post',
        data
    });
}
// 消息模板id
export function msgTemplate(data) {
    return API.request({
        url: '/api/profit/msgTemplate',
        method: 'post',
        data
    });
}
// 消息模板授权
export function profitMes(data) {
    return API.request({
        url: '/api/profit/profitMes',
        method: 'post',
        data
    });
}

export function holiday() {
    return API.request({
        url: '/api/get/holiday',
        method: 'post'
    });
}
