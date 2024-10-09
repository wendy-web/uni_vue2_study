import API from '../xhHttp.js';

// 下单红包预选
export function simulatePacket(data) {
    return API.request({
        url: '/api/savings/simulatePacket',
        method: 'post',
        data
    });
}
// 我的页面省钱卡
export function savingInfo(data) {
    return API.request({
        url: '/api/savings/savingInfo',
        method: 'post',
        data
    });
}
// 列表
export function getLists(data) {
    return API.request({
        url: '/api/Savings/getLists',
        method: 'post',
        data
    });
}
// 开通续费省钱卡
export function buy(data) {
    return API.request({
        url: '/api/Savings/buy',
        method: 'post',
        data
    });
}
// 开通省钱卡轮播
export function savingsSwiper(data) {
    return API.request({
        url: '/api/savings/savingsSwiper',
        method: 'post',
        data
    });
}
// 省钱卡红包
export function nowSavings(data) {
    return API.request({
        url: '/api/savings/nowSavings',
        method: 'post',
        data
    });
}

// 账户红包余额
export function nowPacket(data) {
    return API.request({
        url: '/api/savings/nowPacket',
        method: 'post',
        data
    });
}
// 无效红包
export function oldPacket(data) {
    return API.request({
        url: '/api/savings/oldPacket',
        method: 'post',
        data
    });
}
// 已开通过的省钱卡
export function mySavings(data) {
    return API.request({
        url: '/api/savings/mySavings',
        method: 'post',
        data
    });
}
// 省钱卡详情
export function detailSavings(data) {
    return API.request({
        url: '/api/savings/detailSavings',
        method: 'post',
        data
    });
}
// 省钱卡明细
export function savingDetail(data) {
    return API.request({
        url: '/api/savings/savingDetail',
        method: 'post',
        data
    });
}

// 支付订单
export function orderPay(data) {
    return API.request({
        url: '/api/Savings/orderPay',
        method: 'post',
        data
    });
}

// 省钱卡专享商品
export function goodsList(data) {
    return API.request({
        url: '/api/savings/goodsList',
        method: 'post',
        data
    });
}
// 绑定小店有惠团长
export function teamBind(data) {
    return API.request({
        url: '/api/savings/teamBind',
        method: 'post',
        data
    });
}
// 加量包购买记录
export function dosingPacket(data) {
    return API.request({
        url: '/api/Savings/dosingPacket',
        method: 'post',
        data
    });
}
// 加量包详情
export function detailDosing(data) {
    return API.request({
        url: '/api/Savings/detailDosing',
        method: 'post',
        data
    });
}

// 获取活动
export function getActive(data) {
    return API.request({
        url: '/api/Savings/getActive',
        method: 'post',
        data
    });
}

// 领取活动奖励
export function getSavings(data) {
    return API.request({
        url: '/api/Savings/getSavings',
        method: 'post',
        data
    });
}
