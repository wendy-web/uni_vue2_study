import API from '../xhHttp.js';
// 获取商品分组
export function groupList(data) {
    return API.request({
        url: '/api/profit/groupList',
        method: 'post',
        data
    });
}
// 获取免单商品分组
export function freeGroupList(data) {
    return API.request({
        url: '/api/free/groupList',
        method: 'post',
        data
    });
}
// 获取分组商品列表
export function goodsList(data) {
    return API.request({
        url: '/api/profit/goodsList',
        method: 'post',
        data
    });
}
// 获取免单分组商品列表
export function freeGoodsList(data) {
    return API.request({
        url: '/api/free/goodsList',
        method: 'post',
        data
    });
}

// 进入页面调用，处理页面响应弹窗和数据
export function enterPage(data) {
    return API.request({
        url: '/api/profit/enterPage',
        method: 'post',
        data
    });
}

// 领现金或翻倍
export function getProfit(data) {
    return API.request({
        url: '/api/profit/getProfit',
        method: 'post',
        data
    });
}

// 领取记录
export function getLog(data) {
    return API.request({
        url: '/api/profit/getLog',
        method: 'post',
        data
    });
}

// 小程序首页状态弹窗
export function orderTrace(data) {
    return API.request({
        url: '/api/profit/orderTrace',
        method: 'post',
        data
    });
}

// 免单的初始化
export function freeEnterPage(data) {
    return API.request({
        url: '/api/free/enterPage',
        method: 'post',
        data
    });
}
// 奖品
export function giftList(data) {
    return API.request({
        url: '/api/free/giftList',
        method: 'post',
        data
    });
}
// 选择奖品
export function chooseGift(data) {
    return API.request({
        url: '/api/free/chooseGift',
        method: 'post',
        data
    });
}
// 活动记录
export function activeLog(data) {
    return API.request({
        url: '/api/free/activeLog',
        method: 'post',
        data
    });
}
// 领奖品收货地址
export function addressSubmit(data) {
    return API.request({
        url: '/api/free/addressSubmit',
        method: 'post',
        data
    });
}
// 加速专区分组详情
export function speedXq(data) {
    return API.request({
        url: '/api/free/speedXq',
        method: 'post',
        data
    });
}
// 加速专区分组
export function speedGroup(data) {
    return API.request({
        url: '/api/free/speedGroup',
        method: 'post',
        data
    });
}
// 加速专区分组商品
export function speedGoods(data) {
    return API.request({
        url: '/api/free/speedGoods',
        method: 'post',
        data
    });
}

// 免单和领现金活动检测
export function activeCk(data) {
    return API.request({
        url: '/api/free/activeCk',
        method: 'post',
        data
    });
}
