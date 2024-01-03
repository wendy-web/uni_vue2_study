import API from '../../xhHttp.js';
export function starbucksStore(data) {
    return API.request({
        url: '/api/Qian_zhu/starbucksStore',
        method: 'post',
        data
    });
}
export function starbucksMenus(data) {
    return API.request({
        url: '/api/Qian_zhu/starbucksMenus',
        method: 'post',
        data
    });
}
export function orderSure2(data) {
    return API.request({
        url: '/api/Qian_zhu/orderSure2',
        method: 'post',
        data
    });
}
export function starbucksOrder(data) {
    return API.request({
        url: '/api/Qian_zhu/starbucksOrder',
        method: 'post',
        data
    });
}
export function carChecked(data) {
    return API.request({
        url: '/api/Qian_zhu/carChecked',
        method: 'post',
        data
    });
}