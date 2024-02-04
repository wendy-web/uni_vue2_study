import API from '../xhHttp.js';
// 获取商品分组
export function groupList(data) {
    return API.request({
        url: '/api/profit/groupList',
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
