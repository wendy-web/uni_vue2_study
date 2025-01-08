import API from '../xhHttp.js';
//我的收藏列表
export function collectList(data) {
    return API.request({
        url: '/api/user/collect',
        method: 'post',
        data
    });
}
//添加收藏
export function doCollect(data) {
    return API.request({
        url: '/api/user/doCollect',
        method: 'post',
        data
    });
}
//积分账单
export function creditsLog(data) {
    return API.request({
        url: '/api/task/credits',
        method: 'post',
        data
    });
}
export function holiday() {
    return API.request({
        url: '/api/Post/holiday',
        method: 'post'
    });
}