import API from '../xhHttp.js';
// 外卖红包
export function takeList(data) {
    return API.request({
        url: '/api/Index/takeList',
        method: 'post',
        data
    });
}
// 券列表
export function takeCoupon(data) {
    return API.request({
        url: '/api/Index/takeCoupon',
        method: 'post',
        data
    });
}

// 类目券列表
export function categoryCoupon(data) {
    return API.request({
        url: '/api/Index/categoryCoupon',
        method: 'post',
        data
    });
}

// 类目列表
export function categoryList(data) {
    return API.request({
        url: '/api/Index/categoryList',
        method: 'post',
        data
    });
}
// 消息授权
export function takePower(data) {
    return API.request({
        url: '/api/Index/takePower',
        method: 'post',
        data
    });
}

// 捡漏列表
export function leakList(data) {
    return API.request({
        url: '/api/Index/leakList',
        method: 'post',
        data
    });
}
// 商品详情
export function leshuaDetails(data) {
    return API.request({
        url: '/api/Index/leshuaDetails',
        method: 'post',
        data
    });
}
// 创建订单
export function leakOrder(data) {
    return API.request({
        url: '/api/Shop/leakOrder',
        method: 'post',
        data
    });
}
// 信息
export function goodsTheme(data) {
    return API.request({
        url: '/api/Pinduoduo/goodsTheme',
        method: 'post',
        data
    });
}