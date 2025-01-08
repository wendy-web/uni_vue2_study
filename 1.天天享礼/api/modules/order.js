import API from '../xhHttp.js';

// 我的订单列表
export function orderList(data) {
    return API.request({
        url: '/api/profile/myOrder',
        method: 'post',
        data
    });
}
// 订单详情
export function orderDetail(data) {
    return API.request({
        url: '/api/profile/myOrderDetail',
        method: 'post',
        data
    });
}
// 修改充值账号 {id,charge_account}
export function modifyChargeAccount(data) {
    return API.request({
        url: '/api/profile/modifyChargeAccount',
        method: 'post',
        data
    });
}
// 取消订单
export function cancelOrder(data) {
    return API.request({
        url: '/api/profile/cancelOrder',
        method: 'post',
        data
    });
}
// 修改卡券使用状态
export function verifyOrder(data) {
    return API.request({
        url: '/api/profile/verifyOrder',
        method: 'post',
        data
    });
}
// 查询订单
export function query(data) {
    return API.request({
        url: '/api/shop/query',
        method: 'post',
        data
    });
}
// 支付订单
export function pay(data) {
    return API.request({
        url: '/api/shop/pay',
        method: 'post',
        data
    });
}
// 惠吃喝券申请退款
export function applyRefund(data) {
    return API.request({
        url: '/api/profile/applyRefund',
        method: 'post',
        data
    });
}
