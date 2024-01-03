import API from '../xhHttp.js';
import { getBaseUrl } from "@/utils/auth.js";
const BASEURL = getBaseUrl();
//微信登录
export function wxLogin(data) {
    return API.request({
        url: '/api/post/wxlogin',
        method: 'post',
        data
    });
}
//获取用户信息
export function getUser() {
    return API.request({
        url: '/api/user/myInfo',
        method: 'post',
        type: 'cache'
            // isCache,
            // cacheMaxAge:5//缓存有效时间  单位秒
    });
}
//新版授权登录
export function userprofile(data) {
    return API.request({
        url: '/api/user/updateUser',
        method: 'post',
        data
    });
}

//更新电话号码
export function saveMobile(data) {
    return API.request({
        url: '/api/User/saveMobile',
        method: 'post',
        data
    });
}


//上传图片
export function imgupload() {
    return BASEURL + '/api/tools/imgupload'
}