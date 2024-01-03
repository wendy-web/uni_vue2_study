import API from '../http/xhHttp.js';

//商品列表
export function optionalGoods(data) {
    return API.request({
        url: '/api2/cttxl/optionalGoods',
        method: 'post',
        data,
        isNoLoading: true
    });

}
//频道推荐
export function groupGoods(data, isNoLoading = false) {
    return API.request({
        url: '/api2/cttxl/groupGoods',
        method: 'post',
        data,
        isNoLoading: true
    });

}

//点击商品打开京东半屏
export function bysubunionid(data) {
    return API.request({
        url: '/api2/cttxl/bysubunionid',
        method: 'post',
        data
    });

}
