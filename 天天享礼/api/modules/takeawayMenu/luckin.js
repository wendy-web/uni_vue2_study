import API from '../../xhHttp.js';

export function location(data) {
    return API.request({
        url: '/api/Hai_wei/location',
        method: 'post',
        data
    });
}
// 获取城市/地区餐厅信息
export function restaurantQuery(data) {
    return API.request({
        url: '/api/Hai_wei/restaurantQuery',
        method: 'post',
        data
    });
}

// 获取餐厅菜单信息
export function menuQuery(data) {
    return API.request({
        url: '/api/Hai_wei/menuQuery',
        method: 'post',
        data
    });
}

// 获取产品详情
export function menuDetails(data) {
    return API.request({
        url: '/api/Hai_wei/menuDetails',
        method: 'post',
        data
    });
}
// 加入购物车
export function orderCar(data) {
    return API.request({
        url: '/api/Hai_wei/orderCar',
        method: 'post',
        data
    });
}
// 购物车列表
export function carList(data) {
    return API.request({
        url: '/api/Hai_wei/carList',
        method: 'post',
        data
    });
}

// 清空购物车
export function clearCar(data) {
    return API.request({
        url: '/api/Hai_wei/clearCar',
        method: 'post',
        data
    });
}
// 下单预览
export function orderSure(data) {
    return API.request({
        url: '/api/Hai_wei/orderSure',
        method: 'post',
        data
    });
}

// 创建订单
export function orderCreate(data) {
    return API.request({
        url: '/api/Hai_wei/orderCreate',
        method: 'post',
        data
    });
}

// 支付订单请求
export function orderPay(data) {
    return API.request({
        url: '/api/Hai_wei/orderPay',
        method: 'post',
        data
    });
}
// 搜索历史
export function hwHistory(data) {
    return API.request({
        url: '/api/Hai_wei/hwHistory',
        method: 'post',
        data
    });
}
// 清空搜索历史
export function delHistory(data) {
    return API.request({
        url: '/api/Hai_wei/delHistory',
        method: 'post',
        data
    });
}
// 再来一单
export function orderAgain(data) {
    return API.request({
        url: '/api/Hai_wei/orderAgain',
        method: 'post',
        data
    });
}
// 餐厅购物车检测
export function restaurantCar(data) {
    return API.request({
        url: '/api/Hai_wei/restaurantCar',
        method: 'post',
        data
    });
}
// 消息模板
export function msgTemplate(data) {
    return API.request({
        url: '/api/Hai_wei/msgTemplate',
        method: 'post',
        data
    });
}
// 消息模板
export function restaurantChange(data) {
    return API.request({
        url: '/api/Hai_wei/restaurantChange',
        method: 'post',
        data
    });
}

// 购物车选中
export function carChecked(data) {
    return API.request({
        url: '/api/Hai_wei/carChecked',
        method: 'post',
        data
    });
}