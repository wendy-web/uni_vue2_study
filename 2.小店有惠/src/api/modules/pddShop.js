import API from '../xhHttp.js';
// 商品推广链接
export function goodsPromotion(data) {
    return API.request({
        url: '/api/Pinduoduo/goodsPromotion',
        method: 'post',
        data
    });
}
// 数据库表商品详情
export function goodsDetail(data) {
    return API.request({
        url: '/api/Pinduoduo/goodsDetail',
        method: 'post',
        data
    });
}
// 商品搜索
export function goodsSearch(data) {
    return API.request({
        url: '/api/Pinduoduo/goodsSearch',
        method: 'post',
        data
    });
}
// 收藏商品
export function toggleCollect(data) {
    return API.request({
        url: '/api/Pinduoduo/toggleCollect',
        method: 'post',
        data
    });
}
// 商品推荐
export function goodsRecommend(data) {
    return API.request({
        url: '/api/Pinduoduo/goodsRecommend',
        method: 'post',
        data
    });
}
// 组合查询
export function groupSearch(data) {
    return API.request({
        url: '/api/Pinduoduo/groupSearch',
        method: 'post',
        data
    });
}
