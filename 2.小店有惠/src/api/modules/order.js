import API from '../xhHttp.js';

// 我的订单列表
export function getOrderList(data) {
    return API.request({
        url: '/api/Order/getlist',
        method: 'post',
        data
    });
}
// 订单详情
export function orderDetail(data) {
    return API.request({
        url: '/api/Order/xq',
        method: 'post',
        data
    });
}
// 修改充值账号 {id,charge_account}
export function changeNumber(data) {
    return API.request({
        url: '/api/Order/changeNumber',
        method: 'post',
        data
    });
}
// 取消订单
export function cancelOrder(data) {
    return API.request({
        url: '/api/Order/cache',
        method: 'post',
        data
    });
}
// 修改卡券使用状态
export function verifyOrder(data) {
    return API.request({
        url: '/api/Order/doUse',
        method: 'post',
        data
    });
}
// 查询订单
export function query(data) {
    return API.request({
        url: '/api/Order/query',
        method: 'post',
        data
    });
}
// 支付订单
export function orderPay(data) {
    return API.request({
        url: '/api/Order/pay',
        method: 'post',
        data
    });
}
// 下单
export function createOrder(data) {
    return API.request({
        url: '/api/Order/createOrder',
        method: 'post',
        data
    });
}
// 订单即将超时
export function expireOrder(data) {
    return API.request({
        url: '/api/Order/expireOrder',
        method: 'post',
        data
    });
}