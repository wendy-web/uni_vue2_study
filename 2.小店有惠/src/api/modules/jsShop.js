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

// 商品推荐
export function groupRecommend(data) {
    return API.request({
        url: `/api/goods/groupRecommend`,
        method: 'post',
        data
    });
}
// 组合查询
export function groupSearch(data) {
    return API.request({
        url: `/api/Pinduoduo/groupSearch`,
        method: 'post',
        data
    });
}
