import API from '../xhHttp.js';
//卡劵信息
export function cardInfo(data) {
    return API.request({
        url: '/api/own/cardInfo',
        method: 'post',
        data
    });
}
//领取卡券
export function receiveCard(data) {
    return API.request({
        url: '/api/own/receiveCard',
        method: 'post',
        data
    });
}
//有效卡劵列表
export function validCardList(data) {
    return API.request({
        url: '/api/own/validCardList',
        method: 'post',
        data
    });
}
//卡劵列表
export function allCardList(data) {
    return API.request({
        url: '/api/own/allCardList',
        method: 'post',
        data
    });
}
//卡劵详情
export function cardDetail(data) {
    return API.request({
        url: '/api/own/cardDetail',
        method: 'post',
        data
    });
}