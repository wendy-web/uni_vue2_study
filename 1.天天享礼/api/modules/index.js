import API from '../xhHttp.js';

//优惠推荐
export function couponRecommend(data) {
    return API.request({
        url: '/api/index/couponRecommend',
        method: 'post',
        data
    });
}
//趣味穿逛题目
export function quiz(data) {
    return API.request({
        url: '/api/task/quiz',
        method: 'post',
        data
    });
}
//趣味闯关-答题
export function quizAnswer(data) {
    return API.request({
        url: '/api/task/quizAnswer',
        method: 'post',
        data
    });
}
/*揭秘次数*/
export function revealTimes() {
    return API.request({
        url: '/api/task/revealTimes',
        method: 'post'
    });
}
/*揭秘次数*/
export function quizReveal() {
    return API.request({
        url: '/api/task/quizReveal',
        method: 'post'
    });
}
/*抽奖*/
export function lottery(data) {
    return API.request({
        url: '/api/task/lottery',
        method: 'post',
        data
    });
}
/*抽奖*/
export function lotteryOption(data) {
    return API.request({
        url: '/api/task/lotteryOption',
        method: 'post',
        data
    });
}
/*今日中奖 */
export function lotteryToday() {
    return API.request({
        url: '/api/task/lotteryToday',
        method: 'post',
    });
}
/* 中奖公告 */
export function showWinningInfo() {
    return API.request({
        url: '/api/task/showWinningInfo',
        method: 'post',
    });
}
/*能否答题*/
export function canQuizAnswer() {
    return API.request({
        url: '/api/task/canQuizAnswer',
        method: 'post',
    });
}
/*微信模板*/
export function wxmsgid(group = 0) {
    return API.request({
        url: `/api/get/wxmsgid?group=${group}`,
        method: 'get',
        isNoLoading: true
    });
}

// 商品推荐
export function groupRecommend(data) {
    return API.request({
        url: `/api/Index/groupRecommend`,
        method: 'post',
        data
    });
}
// 授权彬纷享礼信息
export function updateInfo(data) {
    return API.request({
        url: '/api/User/updateInfo',
        method: 'post',
        data
    });
}
// 绑定来源
export function userPosition(data) {
    return API.request({
        url: '/api/User/userPosition',
        method: 'post',
        data
    });
}
// 团长绑定
export function doBind(data) {
    return API.request({
        url: '/api/savings/doBind',
        method: 'post',
        data
    });
}
