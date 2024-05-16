import API from '../xhHttp.js';
// 搜索商品
export function goodsQuery(data) {
    return API.request({
        url: '/api/Get/goodsQuery',
        method: 'post',
        data
    });
}
// 商品分组类目
export function jdGroup(data) {
    return API.request({
        url: '/api/Index/jdGroup',
        method: 'post',
        data
    });
}
// 猜你喜欢
export function material(data) {
    return API.request({
        url: '/api/Jd/material',
        method: 'post',
        data
    });
}
// 精选
export function jingfen(data) {
    return API.request({
        url: '/api/Jd/jingfen',
        method: 'post',
        data
    });
}
// 搜索历史
export function jdHistory(data) {
    return API.request({
        url: '/api/Jd/jdHistory',
        method: 'post',
        data
    });
}

// del搜索历史
export function delHistory(data) {
    return API.request({
        url: '/api/Jd/delHistory',
        method: 'post',
        data
    });
}
// 收藏商品
export function toggleCollect(data) {
    return API.request({
        url: '/api/jd/toggleCollect',
        method: 'post',
        data
    });
}

// 商品推广链接
export function bysubunionid(data) {
    return API.request({
        url: '/api/Jd/bysubunionid',
        method: 'post',
        data
    });
}
export function keywordList(data) {
    return API.request({
        url: '/api/jd/keywordList',
        method: 'post',
        data
    });
}

export function keyword(data) {
    return API.request({
        url: '/api/jd/keyword',
        method: 'post',
        data
    });
}
// 未中奖推荐
export function goodsRecommended(data) {
    return API.request({
        url: '/api/jd/goodsRecommended',
        method: 'post',
        data
    });
}

// 关闭半屏触发同步订单
export function getOrder(data) {
    return API.request({
        url: '/api/jd/getOrder',
        method: 'post',
        data
    });
}
// 京东的更新
export function overDo(data) {
    return API.request({
        url: '/api/index/overDo',
        method: 'post',
        data,
        isColorErrMsg: true
    });
}
// 根据浏览记录推荐 - 猜你喜欢
export function guessList(data) {
    return API.request({
        url: '/api/Jd/guessList',
        method: 'post',
        data
    });
}