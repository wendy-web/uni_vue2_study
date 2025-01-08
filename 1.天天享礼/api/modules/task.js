import API from '../xhHttp.js';

// 设置性别：gender:1男，2女
export function setGender(data) {
    return API.request({
        url: '/api/profile/gender',
        method: 'post',
        data
    });
}
// 设置星座 constellation
export function setConstellation(data) {
    return API.request({
        url: '/api/profile/constellation',
        method: 'post',
        data
    });
}

//获取平台积分
export function getCredits(data) {
    return API.request({
        url: '/api/user/getCredits',
        method: 'post',
        data
    });
}
// 积分升级
export function decCredits(data) {
    return API.request({
        url: '/api/user/decCredits',
        method: 'post',
        data
    });
}
// 每周扫码
export function scanTask(data) {
    return API.request({
        url: '/api/Task/scanTask',
        method: 'post',
        data
    });
}
// 即将过期优惠券
export function expireCoupon() {
    return API.request({
        url: '/api/task/expireCoupon',
        method: 'post',
    });
}
// 即将超时订单
export function expireOrder() {
    return API.request({
        url: '/api/task/expireOrder',
        method: 'post',
    });
}
// 定时活动
export function scheduleActivity() {
    return API.request({
        url: '/api/task/scheduleActivity',
        method: 'post',
    });
}
// 定时活动授权
export function xseckill(data) {
    return API.request({
        url: '/api/Shop/xseckill',
        method: 'post',
        data
    });
}
// 今日收益
export function totalToady() {
    return API.request({
        url: '/api/task/totalToady',
        method: 'post',
    });
}
// 今日收益
export function taskReward() {
    return API.request({
        url: '/api/task/taskReward',
        method: 'post',
    });
}
// 文章列表
export function articleList() {
    return API.request({
        url: '/api/task/articleList',
        method: 'post',
    });
}
// 看文有奖
export function articleAward() {
    return API.request({
        url: '/api/task/articleAward',
        method: 'post',
    });
}
//点亮中国
export function lightTask() {
    return API.request({
        url: '/api/task/lightTask',
        method: 'post',
    });
}
// 换购券即将过期
export function expireRedeemableCoupon() {
    return API.request({
        url: '/api/task/expireRedeemableCoupon',
        method: 'post',
    });
}

//看视频奖励
export function videoAward(data) {
    return API.request({
        url: '/api/task/videoAward',
        method: 'post',
        data
    });
}

//观看视频直播次数
export function canVideo() {
    return API.request({
        url: '/api/task/canVideo',
        method: 'post'
    });
}

// 获取抽奖与看视频的任务次数
export function taskNum() {
    return API.request({
        url: '/api/task/taskNum',
        method: 'post'
    });
}
// 获取模板信息
export function msgTemplete() {
    return API.request({
        url: '/api/profile/msgTemplete',
        method: 'post'
    });
}
// 消息授权
export function powerTemplete(data) {
    return API.request({
        url: '/api/profile/powerTemplete',
        method: 'post',
        data
    });
}