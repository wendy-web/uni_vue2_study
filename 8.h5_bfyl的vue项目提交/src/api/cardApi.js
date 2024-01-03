import request from '@/utils/request'
// 原油墨检验单列表
export function citicinfoApi(data) {
    return request({
        url: '/app/ad/citicinfo',
        method: 'post',
        data
    })
}
//获取用户信息 :中信广告
export function getUserApi(data) {
    return request({
        url: '/app/ad/citicinfo',
        method: 'post',
        data,
        // type: 'cache',
        // cacheMaxAge: 10
        // isCache: true
    });
}
// 创建分享二维码
export function citicqrApi(data) {
    return request({
        url: '/app/ad/citicqr',
        method: 'post',
        data,
        // type: 'cache',
        // cacheMaxAge: 10
        // isCache: true
    });
}
// 提交信息 - 提交到天天
export function reqttxl(data) {
    return request({
        url: '/api/tools/reqttxl',
        method: 'post',
        data,
    });
}
