import { getBaseUrl } from '@/utils/auth';
import API from '../xhHttp.js';
//微信登录
export function wxLogin(data) {
    return API.request({
        url: '/api/post/wxLogin',
        method: 'post',
        data
    });
}
// 获取用户信息 - 获取个人信息换这个接口
// url: '/api/user/info' - '/api/profile/myInfo,
export function getUser() {
    return API.request({
        url: '/api/profile/myInfo',
        method: 'post',
        type: 'cache'
    });
}
// 新版授权登录
export function userprofile(data) {
    return API.request({
        url: '/api/user/updatewx',
        method: 'post',
        data
    });
}
// 修改用户信息
export function updateUser(data) {
    return API.request({
        url: '/api/user/updateUser',
        method: 'post',
        data
    });
}
//上传图片
export function imgupload() {
    let baseUrl = getBaseUrl();
    return baseUrl + '/apios/Tools/uploadImg'
}
// 页面分享
export function share(data) {
    return API.request({
        url: '/api/Index/share',
        method: 'post',
        data
    });
}