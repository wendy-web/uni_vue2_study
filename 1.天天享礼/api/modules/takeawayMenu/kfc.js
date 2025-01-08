import API from '../../xhHttp.js';
// https://ttxl.y1b.cn/api/Qian_zhu/cityStores
export function cityStores(data) {
    return API.request({
        url: '/api/Qian_zhu/cityStores',
        method: 'post',
        data
    });
}
export function kfcMenus(data) {
    return API.request({
        url: '/api/Qian_zhu/kfcMenus',
        method: 'post',
        data
    });
}

export function carList(data) {
    return API.request({
        url: '/api/Qian_zhu/carList',
        method: 'post',
        data
    });
}
export function clearCar(data) {
    return API.request({
        url: '/api/Qian_zhu/clearCar',
        method: 'post',
        data
    });
}
export function orderCar(data) {
    return API.request({
        url: '/api/Qian_zhu/orderCar',
        method: 'post',
        data
    });
}

export function orderSure(data) {
    return API.request({
        url: '/api/Qian_zhu/orderSure',
        method: 'post',
        data
    });
}
export function orderCreate(data) {
    return API.request({
        url: '/api/Qian_zhu/orderCreate',
        method: 'post',
        data
    });
}

export function storesCk(data) {
    return API.request({
        url: '/api/Qian_zhu/storesCk',
        method: 'post',
        data
    });
}
export function kfcHistory(data) {
    return API.request({
        url: '/api/Qian_zhu/kfcHistory',
        method: 'post',
        data
    });
}
export function delHistory(data) {
    return API.request({
        url: '/api/Qian_zhu/delHistory',
        method: 'post',
        data
    });
}
export function orderAgain(data) {
    return API.request({
        url: '/api/Qian_zhu/orderAgain',
        method: 'post',
        data
    });
}