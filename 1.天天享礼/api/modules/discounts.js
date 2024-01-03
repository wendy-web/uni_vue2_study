import API from '../xhHttp.js';
//  type = 2-肯德基 3-星巴克
export function products(data) {
    return API.request({
        url: '/api/Qian_zhu/products',
        method: 'post',
        data
    });
}

// 获取城市列表
export function cities() {
    return API.request({
        url: '/api/Qian_zhu/cities',
        method: 'post',
    });
}

// cityId: 城市id
export function films(data) {
    return API.request({
        url: '/api/Qian_zhu/films',
        method: 'post',
        data
    });
}
// https://ttxl.y1b.cn/api/Qian_zhu/jumpLink
export function jumpLink(data) {
    return API.request({
        url: '/api/Qian_zhu/jumpLink',
        method: 'post',
        data
    });
}
// 获取城市
export function location(data) {
    return API.request({
        url: '/api/Hai_wei/location',
        method: 'post',
        data
    });
}

// 授权手机号
export function doPower(data) {
    return API.request({
        url: '/api/Qian_zhu/doPower',
        method: 'post',
        data
    });
}
// 同步订单
export function qianzhuOrder() {
    return API.request({
        url: '/api/Get/qianzhuOrder',
        method: 'post',
    });
}

// 附近门店
export function nearStore(data) {
    return API.request({
        url: '/api/Hai_wei/nearStore',
        method: 'post',
        data
    });
}
// h5入口
export function hwHome(data) {
    return API.request({
        url: '/api/Hai_wei/hwHome',
        method: 'post',
        data
    });
}
// h5产品显隐
export function hwStatus(data) {
    return API.request({
        url: '/api/hai_wei/hwStatus',
        method: 'post',
        data
    });
}
