import API from '../xhHttp.js';

// 限时活动-抢购和领券
export function seckill(data) {
    return API.request({
        url: '/api/shop/seckill',
        method: 'post',
        data
    });
}
//限时活动-抢购和领券
export function exchange(data) {
    return API.request({
        url: '/api/shop/exchange',
        method: 'post',
        data
    });
}
//兑换公告
export function exchangeNotice() {
    return API.request({
        url: '/api/index/exchangeNotice',
        method: 'post'
    });
}
//优惠券分组
export function couponGroup(data) {
    return API.request({
        url: '/api/index/couponGroup',
        method: 'post',
        data
    });
}
//优惠券列表
export function couponList(data) {
    return API.request({
        url: '/api/index/couponList',
        method: 'post',
        data
    });
}

//优惠券详情
export function couponDetails(data) {
    return API.request({
        url: '/api/index/couponDetails',
        method: 'post',
        data
    });
}

// 兑换优惠券检查
export function exchangeCk(data) {
    return API.request({
        url: '/api/Shop/exchangeCk',
        method: 'post',
        data
    });
}

//轮播
export function banner() {
    return API.request({
        url: '/api/index/banner',
        method: 'post'
    });
}

//轮播
export function sale() {
    return API.request({
        url: '/api/index/sale',
        method: 'post'
    });
}

// 图文导航
export function textNav() {
    return API.request({
        url: '/api/Index/textNav',
        method: 'post'
    });
}
// 天天享礼展示弹窗
export function bfxlPopup(data) {
    return API.request({
        url: '/api/index/bfxlPopup',
        method: 'post',
        data
    });
}
// 乐维娃娃机
export function houseUrl() {
    return API.request({
        url: '/api/Lw/houseUrl',
        method: 'post'
    });
}

export function giftCreate() {
    return API.request({
        url: '/api/index/giftCreate',
        method: 'post'
    });
}

// 奖品查看-跳转天天享礼调用
export function drawPopover(data) {
    return API.request({
        url: '/api/whirligig/drawPopover',
        method: 'post',
        data
    });
}

// 详情内容获取
export function goodsDetails(data) {
    return API.request({
        url: '/api/pinduoduo/goodsDetails',
        method: 'post',
        data
    });
}
// api/post/advertisementConfig
export function advertisementConfig(data) {
    return API.request({
        url: '/api/post/advertisementConfig',
        method: 'post',
        data
    });
}
// 记录牛金豆的扣取
export function creditsDraw(data) {
    return API.request({
        url: '/api/Task/creditsDraw',
        method: 'post',
        data
    });
}
// 首页插屏广告
export function cpAdvertising(data) {
    return API.request({
        url: '/api/index/cpAdvertising',
        method: 'post',
        data
    });
}