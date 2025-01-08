import API from '../xhHttp.js';
import { getPlatform } from "@/utils/auth.js";
const platform = getPlatform();
// 签到列表
export function signList() {
    return API.request({
        url: '/api/task/signList',
        method: 'post'
    });
}
// 用户签到
export function doSign(data) {
    return API.request({
        url: '/api/task/doSign',
        method: 'post',
        data
    });
}

// 任务列表
export function taskIndex(data) {
    return API.request({
        url: '/api/task/index',
        method: 'post',
        data
    });
}

// 做任务
export function doTask(data) {
    return API.request({
        url: '/api/task/doTask',
        method: 'post',
        data
    });
}

// 商品推荐
export function recommend() {
    return API.request({
        url: '/api/Goods/recommend',
        method: 'post',
        data: { device: platform }
    });
}