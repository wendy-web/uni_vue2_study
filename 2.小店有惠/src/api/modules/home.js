import API from '../xhHttp.js';
import { getPlatform } from "@/utils/auth.js";
const platform = getPlatform();
//商品分组
export function goodsGroup() {
    return API.request({
        url: '/api/goods/group',
        method: 'post',
        data: { device: platform }
    });
}
// 商品列表
export function goodsList(data) {
    return API.request({
        url: '/api/goods/list',
        method: 'post',
        data
    });
}
// 商品详情
export function goodsXq(data) {
    return API.request({
        url: '/api/goods/xq',
        method: 'post',
        data
    });
}

// 获取其他平台积分
export function getCredits(data) {
    return API.request({
        url: '/api/user/getCredits',
        method: 'post',
        data
    });
}

// 用户增加获取的积分
export function decCredits(data) {
    return API.request({
        url: '/api/user/decCredits',
        method: 'post',
        data
    });
}
// 弹窗
export function popover(data) {
    return API.request({
        url: '/api/post/popover',
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
// 单例图
export function singleton(data) {
    return API.request({
        url: '/api/Team_apply/singleton',
        method: 'post',
        data
    });
}